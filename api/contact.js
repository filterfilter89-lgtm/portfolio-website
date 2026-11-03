/**
 * Vercel Serverless Function / Local Vite Dev API Handler
 * POST /api/contact - Submit inquiry/message
 * GET  /api/contact - Health & status of contact endpoint
 */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method === 'GET') {
    res.statusCode = 200;
    return res.end(JSON.stringify({
      status: 'active',
      endpoint: '/api/contact',
      methods: ['POST', 'GET'],
      description: 'Portfolio contact & client inquiry endpoint'
    }));
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        body = {};
      }
    }

    const { name, email, message, subject = 'General Inquiry', service = 'General' } = body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.statusCode = 400;
      return res.end(JSON.stringify({
        success: false,
        error: 'A valid email address is required.'
      }));
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.statusCode = 400;
      return res.end(JSON.stringify({
        success: false,
        error: 'Message content cannot be empty.'
      }));
    }

    const submissionId = 'sub_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    const submission = {
      id: submissionId,
      name: (name || 'Anonymous').trim(),
      email: email.trim(),
      subject: subject.trim(),
      service: service.trim(),
      message: message.trim(),
      receivedAt: new Date().toISOString()
    };

    console.log('[PORTFOLIO INQUIRY RECEIVED]:', JSON.stringify(submission));

    res.statusCode = 201;
    return res.end(JSON.stringify({
      success: true,
      message: 'Thank you! Your message has been received.',
      submissionId: submission.id,
      receivedAt: submission.receivedAt
    }, null, 2));

  } catch (error) {
    console.error('Error handling contact request:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({
      success: false,
      error: 'An internal server error occurred while processing your message.'
    }));
  }
}

