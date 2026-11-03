/**
 * Frontend API Client for Basil Jose Portfolio
 * Connects to both local Vite dev API (/api/*) and live Vercel Serverless Functions
 */

export async function getApiHealth() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Health check unreachable:', err.message);
    return { status: 'offline', error: err.message };
  }
}

export async function submitContact(contactData) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error('[API] Contact submission failed:', err);
    throw err;
  }
}

export async function getProjects(filter = {}) {
  try {
    const params = new URLSearchParams();
    if (filter.category) params.set('category', filter.category);
    if (filter.search) params.set('search', filter.search);
    if (filter.id) params.set('id', filter.id);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/projects${query}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Fetching dynamic projects failed, fallback to local data:', err.message);
    return null;
  }
}

export async function getPortfolioStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Stats check unreachable:', err.message);
    return null;
  }
}
