import os

path = 'src/components/AlbumCarousel.jsx'
with open(path, 'r', encoding='utf-8') as f:
    s = f.read()

s = s.replace('\r\n', '\n')

start_needle = '// Draggable Physical Paper Airmail Postcard Component'
end_needle = 'export default function AlbumCarousel({'

idx1 = s.find(start_needle)
idx2 = s.find(end_needle)

if idx1 == -1 or idx2 == -1:
    print(f'Error: could not find markers: {idx1}, {idx2}')
    exit(1)

new_draggable_postcard = '''// Draggable Physical Paper Airmail Postcard Component (Simultaneous 3D Flight & Flip)
const DraggablePostcard = memo(function DraggablePostcard({
  project,
  index,
  totalCount,
  category,
  isRetracting,
  isScattered,
  isExpanded,
  isAnyCardExpanded,
  onOpenProject,
  onCloseProject,
  scatterSlot,
  centerAlbumTop,
  vw,
  vh,
  cardWidth: cardW,
  isMobile
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const [hasEverBeenExpanded, setHasEverBeenExpanded] = useState(isExpanded);

  useEffect(() => {
    if (isExpanded) {
      setHasEverBeenExpanded(true);
    }
  }, [isExpanded]);

  const hasMultipleMedia = Boolean(project.media && project.media.length > 1);

  const parseUnit = (valStr, dimension) => {
    if (typeof valStr === 'string' && valStr.endsWith('vw')) {
      return (parseFloat(valStr) / 100) * vw;
    }
    if (typeof valStr === 'string' && (valStr.endsWith('vh') || valStr.endsWith('dvh'))) {
      return (parseFloat(valStr) / 100) * vh;
    }
    return parseFloat(valStr) || 0;
  };

  const targetX = parseUnit(scatterSlot.left, vw);
  const targetY = parseUnit(scatterSlot.top, vh);

  // Card dimensions on desk
  const restingW = cardW;
  const restingH = Math.round(cardW * 0.5625);

  // Card dimensions when expanded to 70% viewport
  const enlargedW = isMobile ? Math.round(vw * 0.92) : Math.min(Math.round(vw * 0.74), 1120);
  const enlargedH = Math.round(enlargedW * 0.5625);

  // Initial emergence delta from album mouth
  const mouthX = vw / 2 - (isMobile ? Math.min(160, vw * 0.43) : cardW / 2);
  const mouthY = centerAlbumTop;
  const mouthDeltaX = Math.round(mouthX - targetX);
  const mouthDeltaY = Math.round(mouthY - targetY);

  // Travel delta from resting slot to center screen
  const restingLeft = Math.round(targetX - restingW / 2);
  const restingTop = Math.round(targetY - restingH / 2);
  const centerLeft = Math.round(vw / 2 - enlargedW / 2);
  const centerTop = Math.round(vh / 2 - enlargedH / 2);
  const travelX = centerLeft - restingLeft;
  const travelY = centerTop - restingTop;

  const handlePointerDown = (e) => {
    if (isExpanded) return;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    hasMovedRef.current = false;
  };

  const handleDragStart = () => {
    if (isExpanded) return;
    setIsDragging(true);
    hasMovedRef.current = true;
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 80);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isDragging || hasMovedRef.current || isRetracting) return;
    if (!isExpanded) {
      onOpenProject(project);
    }
  };

  let animateTarget = {
    x: 0,
    y: 0,
    width: restingW,
    height: restingH,
    rotate: scatterSlot.rot,
    rotateY: 0,
    opacity: 1,
    zIndex: isDragging ? 125 : 35 + scatterSlot.z,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
  };

  if (isRetracting) {
    animateTarget = {
      x: mouthDeltaX,
      y: mouthDeltaY + 50,
      width: restingW,
      height: restingH,
      rotate: 0,
      rotateY: 0,
      opacity: 0,
      zIndex: 10,
      transition: {
        duration: 0.42,
        delay: (totalCount - 1 - index) * 0.04,
        ease: [0.36, 0, 0.66, -0.56]
      }
    };
  } else if (isExpanded) {
    animateTarget = {
      x: travelX,
      y: travelY,
      width: enlargedW,
      height: enlargedH,
      rotate: 0,
      rotateY: 180,
      opacity: 1,
      zIndex: 250,
      transition: {
        duration: 0.68,
        ease: [0.22, 1, 0.36, 1]
      }
    };
  } else if (isAnyCardExpanded) {
    animateTarget = {
      x: 0,
      y: 0,
      width: restingW,
      height: restingH,
      rotate: scatterSlot.rot,
      rotateY: 0,
      opacity: 0.22,
      zIndex: 35 + scatterSlot.z,
      transition: { duration: 0.45, ease: 'easeOut' }
    };
  } else if (!isScattered) {
    animateTarget = {
      x: [mouthDeltaX, mouthDeltaX, 0],
      y: [mouthDeltaY + 50, mouthDeltaY - 140, 0],
      width: restingW,
      height: restingH,
      rotate: [0, 0, scatterSlot.rot],
      rotateY: 0,
      opacity: [0, 1, 1],
      zIndex: 35 + scatterSlot.z,
      transition: {
        duration: 0.72,
        times: [0, 0.35, 1],
        delay: 0.04 + index * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }
    };
  }

  return (
    <motion.div
      className={draggable-postcard-item postcard-16-9  }
      style={{
        position: 'absolute',
        left: restingLeft,
        top: restingTop,
        transformStyle: 'preserve-3d',
        perspective: 2000,
        pointerEvents: isAnyCardExpanded && !isExpanded ? 'none' : 'auto',
        cursor: isExpanded ? 'default' : 'grab'
      }}
      drag={!isRetracting && !isExpanded}
      dragMomentum={false}
      dragElastic={0.08}
      onPointerDown={handlePointerDown}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      initial={{
        x: mouthDeltaX,
        y: mouthDeltaY + 50,
        width: restingW,
        height: restingH,
        rotate: 0,
        rotateY: 0,
        opacity: 0
      }}
      animate={animateTarget}
      role=button
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isExpanded) onOpenProject(project);
        }
      }}
      aria-label={Postcard for }
    >
      <div
        className=postcard-3d-flipper
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          borderRadius: isExpanded ? '6px' : '4px',
          boxShadow: isExpanded
            ? '0 40px 100px rgba(0, 8, 26, 0.7), 0 10px 30px rgba(0, 0, 0, 0.4)'
            : isDragging
            ? '0 30px 60px rgba(0, 10, 35, 0.45)'
            : '0 14px 28px rgba(0, 12, 32, 0.35), 0 4px 10px rgba(0, 0, 0, 0.18)'
        }}
      >
        {/* Front Face: Postcard Artwork */}
        <div
          className=postcard-side postcard-side-front
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            zIndex: 2,
            borderRadius: isExpanded ? '6px' : '4px',
            overflow: 'hidden'
          }}
        >
          <div className=postcard-16-9-wrapper style={{ width: '100%', height: '100%' }}>
            <PostcardSVG project={project} category={category} index={index} />
          </div>
        </div>

        {/* Back Face: Revealed on 180 deg Flip */}
        <div
          className=postcard-side postcard-side-back
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            zIndex: 3,
            background: '#fff7ed',
            borderRadius: isExpanded ? '6px' : '4px',
            overflow: 'hidden',
            pointerEvents: isExpanded ? 'auto' : 'none'
          }}
        >
          {isExpanded && (
            <button
              type=button
              className=enlarged-postcard-close-btn
              onClick={(e) => {
                e.stopPropagation();
                onCloseProject();
              }}
              aria-label=Close enlarged postcard
            >
              <svg width=20 height=20 viewBox=0 0 24 24 fill=none stroke=currentColor strokeWidth=2.5 strokeLinecap=round strokeLinejoin=round>
                <line x1=18 y1=6 x2=6 y2=18 />
                <line x1=6 y1=6 x2=18 y2=18 />
              </svg>
            </button>
          )}

          {(isExpanded || hasEverBeenExpanded) && (
            hasMultipleMedia ? (
              <PolaroidGallery items={project.media} project={project} />
            ) : (
              <InCardVideoPlayer project={project} media={project.media?.[0]} />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
});

'''

s = s[:idx1] + new_draggable_postcard + s[idx2:]

# 2. Update the JSX return where postcards and backdrop are rendered
old_return_postcards_start = '{selectedCategory && showPostcards && ('
old_return_postcards_end = '    </div>\n  );\n}'

r_idx1 = s.find(old_return_postcards_start)
r_idx2 = s.find(old_return_postcards_end, r_idx1)

if r_idx1 == -1 or r_idx2 == -1:
    print(f'Error finding return markers: {r_idx1}, {r_idx2}')
    exit(1)

new_return_postcards = '''{selectedCategory && showPostcards && (
        <div className=scattered-envelopes-wrapper>
          {/* Dimmed & Blurred Desk Backdrop */}
          <AnimatePresence>
            {activeFullscreenProject && (
              <motion.div
                className=enlarged-postcard-backdrop
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: 'easeInOut' }}
                onClick={handleCloseProject}
              />
            )}
          </AnimatePresence>

          {selectedCategory.projects.map((proj, idx) => {
            const slots = isMobile ? MOBILE_SCATTER_SLOTS : DEFAULT_SCATTER_SLOTS;
            const scatter = slots[idx % slots.length];
            return (
              <DraggablePostcard
                key={proj.id}
                project={proj}
                index={idx}
                totalCount={selectedCategory.projects.length}
                category={selectedCategory}
                isRetracting={isRetractingPostcards}
                isScattered={isCardsScattered}
                isExpanded={activeFullscreenProject?.id === proj.id}
                isAnyCardExpanded={Boolean(activeFullscreenProject)}
                onOpenProject={handleOpenProject}
                onCloseProject={handleCloseProject}
                scatterSlot={scatter}
                centerAlbumTop={centerAlbumTop}
                vw={vw}
                vh={vh}
                cardWidth={cardWidth}
                isMobile={isMobile}
              />
            );
          })}
        </div>
      )}
'''

s = s[:r_idx1] + new_return_postcards + s[r_idx2:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(s)
print('Successfully updated AlbumCarousel.jsx with continuous 3D flight & flip!')
