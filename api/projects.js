/**
 * Vercel Serverless Function / Local Vite Dev API Handler
 * GET /api/projects
 * Query params: ?category=id & ?search=query
 */
import { CATEGORIES } from '../src/data/categories.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  try {
    const url = new URL(req.url, 'http://localhost');
    const categoryQuery = url.searchParams.get('category');
    const searchQuery = url.searchParams.get('search');
    const idQuery = url.searchParams.get('id');

    let resultCategories = CATEGORIES;

    if (categoryQuery) {
      resultCategories = resultCategories.filter(
        c => c.id.toLowerCase() === categoryQuery.toLowerCase()
      );
    }

    if (idQuery) {
      for (const cat of CATEGORIES) {
        const found = (cat.projects || []).find(p => p.id.toLowerCase() === idQuery.toLowerCase());
        if (found) {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            success: true,
            category: cat.id,
            project: found
          }, null, 2));
        }
      }
      res.statusCode = 404;
      return res.end(JSON.stringify({
        success: false,
        error: `Project '${idQuery}' not found.`
      }));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      resultCategories = resultCategories.map(cat => ({
        ...cat,
        projects: (cat.projects || []).filter(
          p => p.title?.toLowerCase().includes(q) ||
               p.description?.toLowerCase().includes(q) ||
               p.role?.toLowerCase().includes(q)
        )
      })).filter(cat => cat.projects.length > 0 || cat.title.toLowerCase().includes(q));
    }

    const totalProjects = resultCategories.reduce(
      (acc, c) => acc + (c.projects?.length || 0), 0
    );

    res.statusCode = 200;
    return res.end(JSON.stringify({
      success: true,
      categoriesCount: resultCategories.length,
      totalProjects,
      categories: resultCategories
    }, null, 2));

  } catch (error) {
    console.error('Error fetching projects:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({
      success: false,
      error: 'Failed to retrieve portfolio projects data.'
    }));
  }
}
