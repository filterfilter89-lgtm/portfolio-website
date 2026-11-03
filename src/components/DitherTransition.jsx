import { useEffect, useRef } from 'react';

const BAYER_8X8 = new Uint8Array([
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
].map(v => Math.round((v + 0.5) * (255 / 64))));

function hexToRgb(hex) {
  let c = (hex || '#336196').replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

const VS_SOURCE = [
  'attribute vec2 a_pos;',
  'void main() {',
  '  gl_Position = vec4(a_pos, 0.0, 1.0);',
  '}'
].join('\n');

// 8-Point Diamond Starburst (✴) Halftone Shader - 100% PURE STARBURST DITHER (NO CIRCLE)
const FS_SOURCE = [
  'precision mediump float;',
  'uniform vec2 u_resolution;',
  'uniform vec2 u_origin;',
  'uniform float u_t;',
  'uniform vec3 u_color;',
  'uniform float u_maxDist;',
  'uniform float u_cellSize;',
  'uniform float u_bandWidth;',
  'uniform float u_sourceShape; // 0.0 = radial wave, 1.0 = box edges wave',
  'uniform float u_boxHalfSize;',
  'uniform float u_isUniform;   // 1.0 = pure screen-wide dither (ZERO RIPPLE)',
  'uniform sampler2D u_bayer;',
  '',
  'void main() {',
  '  vec2 pos = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);',
  '',
  '  if (u_t >= 0.995) {',
  '    gl_FragColor = vec4(u_color, 1.0);',
  '    return;',
  '  }',
  '  if (u_t <= 0.005) {',
  '    discard;',
  '  }',
  '',
  '  vec2 cellCoord = floor(pos / u_cellSize);',
  '  vec2 cellCenter = (cellCoord + 0.5) * u_cellSize;',
  '  vec2 cellOffset = pos - cellCenter;',
  '  float maxRadius = u_cellSize * 0.74;',
  '',
  '  float localIntensity = 0.0;',
  '',
  '  if (u_isUniform > 0.5) {',
  '    // Pure uniform screen-wide dither dissolve - ZERO RIPPLE / ZERO WAVE',
  '    localIntensity = u_t * 1.35;',
  '  } else {',
  '    float dist = 0.0;',
  '    if (u_sourceShape > 0.5) {',
  '      vec2 d = max(abs(cellCenter - u_origin) - vec2(u_boxHalfSize), 0.0);',
  '      dist = max(d.x, d.y);',
  '    } else {',
  '      dist = length(cellCenter - u_origin);',
  '    }',
  '    float normDist = dist / u_maxDist;',
  '    float waveFront = u_t * 1.34;',
  '    if (normDist > waveFront) {',
  '      discard;',
  '    }',
  '    float waveDelta = waveFront - normDist;',
  '    localIntensity = waveDelta / u_bandWidth;',
  '  }',
  '',
  '  vec2 bayerUV = fract((cellCoord + 0.5) / 8.0);',
  '  float bayerVal = texture2D(u_bayer, bayerUV).r;',
  '',
  '  if (localIntensity > bayerVal) {',
  '    float dotProgress = min(1.0, (localIntensity - bayerVal) / 0.32);',
  '    // Starburst radius expands smoothly; points overlap to blanket screen organically without any circle cutoff',
  '    float r = max(1.0, dotProgress * maxRadius * (1.0 + max(0.0, localIntensity - 1.0) * 0.45));',
  '',
  '    // Classic Round Halftone Dither Dot (Restored - NO STAR)',
  '    if (length(cellOffset) <= r) {',
  '      gl_FragColor = vec4(u_color, 1.0);',
  '      return;',
  '    }',
  '  }',
  '',
  '  discard;',
  '}'
].join('\n');

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Shader compile failed: ' + info);
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog);
    gl.deleteProgram(prog);
    throw new Error('Program link failed: ' + info);
  }
  return prog;
}

export default function DitherTransition({
  isActive = false,
  origin = null,
  cellSize = 12,
  direction = 'forward',
  color = '#336196',
  sourceShape = 'uniform',
  boxHalfSize = 0,
  duration = 750,
  zIndex = 1000,
  onComplete
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const isUniform = sourceShape === 'uniform' || sourceShape === 'screen';
    const isBox = sourceShape === 'box';
    const isReverse = direction === 'reverse';
    const startTime = performance.now();
    let animationFrameId;
    let isCompletedWebGL = false;
    let isCompleted2D = false;

    let originX = origin ? origin.x : width / 2;
    let originY = origin ? origin.y : height / 2;
    originX *= dpr;
    originY *= dpr;

    const corners = [
      { x: 0, y: 0 },
      { x: width * dpr, y: 0 },
      { x: 0, y: height * dpr },
      { x: width * dpr, y: height * dpr }
    ];
    let maxDist = 0;
    for (const c of corners) {
      const d = Math.hypot(c.x - originX, c.y - originY);
      if (d > maxDist) maxDist = d;
    }

    const scaledBoxHalfSize = boxHalfSize * dpr;

    let gl = null;
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: true, depth: false, preserveDrawingBuffer: true });
    } catch {
      gl = null;
    }

    if (gl) {
      let program;
      try {
        program = createProgram(gl, VS_SOURCE, FS_SOURCE);
      } catch (err) {
        console.warn('WebGL init failed, fallback to 2D:', err);
        gl = null;
      }

      if (gl && program) {
        gl.useProgram(program);

        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
          gl.STATIC_DRAW
        );

        const aPosLoc = gl.getAttribLocation(program, 'a_pos');
        gl.enableVertexAttribArray(aPosLoc);
        gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

        const bayerTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, bayerTex);
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.LUMINANCE, 8, 8, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, BAYER_8X8
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        const uResLoc = gl.getUniformLocation(program, 'u_resolution');
        const uOriginLoc = gl.getUniformLocation(program, 'u_origin');
        const uTLoc = gl.getUniformLocation(program, 'u_t');
        const uColorLoc = gl.getUniformLocation(program, 'u_color');
        const uMaxDistLoc = gl.getUniformLocation(program, 'u_maxDist');
        const uCellSizeLoc = gl.getUniformLocation(program, 'u_cellSize');
        const uBandWidthLoc = gl.getUniformLocation(program, 'u_bandWidth');
        const uSourceShapeLoc = gl.getUniformLocation(program, 'u_sourceShape');
        const uBoxHalfSizeLoc = gl.getUniformLocation(program, 'u_boxHalfSize');
        const uIsUniformLoc = gl.getUniformLocation(program, 'u_isUniform');
        const uBayerLoc = gl.getUniformLocation(program, 'u_bayer');

        gl.uniform2f(uResLoc, width * dpr, height * dpr);
        gl.uniform2f(uOriginLoc, originX, originY);
        gl.uniform3fv(uColorLoc, hexToRgb(color));
        gl.uniform1f(uMaxDistLoc, maxDist);
        gl.uniform1f(uCellSizeLoc, cellSize * dpr);
        gl.uniform1f(uBandWidthLoc, 0.32);
        gl.uniform1f(uSourceShapeLoc, isBox ? 1.0 : 0.0);
        gl.uniform1f(uBoxHalfSizeLoc, scaledBoxHalfSize);
        gl.uniform1f(uIsUniformLoc, isUniform ? 1.0 : 0.0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, bayerTex);
        gl.uniform1i(uBayerLoc, 0);

        gl.viewport(0, 0, width * dpr, height * dpr);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        function renderWebGL(now) {
          const elapsed = now - startTime;
          const rawProgress = Math.min(1, elapsed / duration);
          const t = isReverse ? 1 - rawProgress : rawProgress;

          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.uniform1f(uTLoc, t);
          gl.drawArrays(gl.TRIANGLES, 0, 6);

          if (rawProgress < 1) {
            animationFrameId = requestAnimationFrame(renderWebGL);
          } else if (!isCompletedWebGL) {
            isCompletedWebGL = true;
            // Draw the final completed solid frame once. With preserveDrawingBuffer: true,
            // WebGL retains the frame indefinitely with ZERO ongoing CPU/GPU usage!
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(uTLoc, isReverse ? 0.0 : 1.0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            if (onComplete) onComplete();
          }
        }

        animationFrameId = requestAnimationFrame(renderWebGL);
      }
    }

    if (!gl) {
      // 2D Canvas fallback with pure starburst dither (NO CIRCLE)
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const scaledCellSize = cellSize * dpr;
        const cols = Math.ceil((width * dpr) / scaledCellSize);
        const rows = Math.ceil((height * dpr) / scaledCellSize);
        const bandWidth = 0.32;

        function render2D(now) {
          const elapsed = now - startTime;
          const rawProgress = Math.min(1, elapsed / duration);
          const t = isReverse ? 1 - rawProgress : rawProgress;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (t >= 0.995) {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (t > 0.005) {
            ctx.fillStyle = color;
            const maxRadius = scaledCellSize * 0.74;

            ctx.beginPath();
            for (let ry = 0; ry < rows; ry++) {
              const cy = ry * scaledCellSize + scaledCellSize / 2;
              const dy = cy - originY;
              const bRow = (ry % 8) * 8;
              for (let rx = 0; rx < cols; rx++) {
                const cx = rx * scaledCellSize + scaledCellSize / 2;
                const dx = cx - originX;

                let localIntensity = 0;
                if (isUniform) {
                  localIntensity = t * 1.35;
                } else {
                  let dist = 0;
                  if (isBox) {
                    const bx = Math.max(0, Math.abs(dx) - scaledBoxHalfSize);
                    const by = Math.max(0, Math.abs(dy) - scaledBoxHalfSize);
                    dist = Math.max(bx, by);
                  } else {
                    dist = Math.hypot(dx, dy);
                  }

                  const nd = dist / maxDist;
                  const waveFront = t * 1.34;
                  if (nd > waveFront) continue;

                  localIntensity = (waveFront - nd) / bandWidth;
                }
                const bVal = (BAYER_8X8[bRow + (rx % 8)] + 0.5) / 255;
                if (localIntensity > bVal) {
                  const dotProgress = Math.min(1, (localIntensity - bVal) / 0.32);
                  const r = Math.max(1, dotProgress * maxRadius * (1 + Math.max(0, localIntensity - 1) * 0.45));

                  // Classic circular halftone dither dot (Restored - NO STAR)
                  ctx.moveTo(cx + r, cy);
                  ctx.arc(cx, cy, r, 0, Math.PI * 2);
                }
              }
            }
            ctx.fill();
          }

          if (rawProgress < 1) {
            animationFrameId = requestAnimationFrame(render2D);
          } else if (!isCompleted2D) {
            isCompleted2D = true;
            if (!isReverse) {
              ctx.fillStyle = color;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            if (onComplete) onComplete();
          }
        }

        animationFrameId = requestAnimationFrame(render2D);
      }
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, origin, cellSize, direction, color, sourceShape, boxHalfSize, duration, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="dither-transition-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: zIndex,
        display: 'block'
      }}
      aria-hidden="true"
    />
  );
}
