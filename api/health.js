/**
 * Vercel Serverless Function / Local Vite Dev API Handler
 * GET /api/health
 */
export default async function handler(req, res) {
  const uptime = process.uptime();
  const memory = process.memoryUsage();

  const data = {
    status: 'ok',
    service: 'basil-jose-portfolio-api',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    version: '1.0.0',
    nodeVersion: process.version,
    memoryUsageMB: Math.round(memory.heapUsed / 1024 / 1024)
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.statusCode = 200;
  res.end(JSON.stringify(data, null, 2));
}

