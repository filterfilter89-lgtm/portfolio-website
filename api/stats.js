/**
 * Vercel Serverless Function / Local Vite Dev API Handler
 * GET /api/stats
 */
import { CATEGORIES } from '../src/data/categories.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  try {
    const totalCategories = CATEGORIES.length;
    const totalProjects = CATEGORIES.reduce((acc, cat) => acc + (cat.projects?.length || 0), 0);
    const categoryBreakdown = CATEGORIES.map(cat => ({
      id: cat.id,
      title: cat.title,
      projectCount: cat.projects?.length || 0
    }));

    res.statusCode = 200;
    return res.end(JSON.stringify({
      success: true,
      service: 'basil-jose-portfolio',
      stats: {
        totalCategories,
        totalProjects,
        totalVisualFrames: 49,
        categoryBreakdown,
        serverTime: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        status: 'online'
      }
    }, null, 2));
  } catch (error) {
    console.error('Error generating stats:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({
      success: false,
      error: 'Failed to retrieve stats.'
    }));
  }
}

