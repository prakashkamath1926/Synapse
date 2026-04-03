// Vercel serverless catch-all proxy → remote FastAPI backend
// This handles all /api/* routes since Vercel Free cannot rewrite to external URLs

const BACKEND_URL = process.env.BACKEND_URL || 'https://synapse-50ji.onrender.com';

export default async function handler(req, res) {
  const { path = [] } = req.query;
  const targetPath = '/api/' + (Array.isArray(path) ? path.join('/') : path);
  const targetUrl = `${BACKEND_URL}${targetPath}`;

  // Forward query string (excluding the path param itself)
  const { path: _omit, ...queryParams } = req.query;
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

  try {
    // Build outbound headers (forward content-type, auth, etc.)
    const forwardHeaders = {
      'Content-Type': req.headers['content-type'] || 'application/json',
    };
    if (req.headers['authorization']) {
      forwardHeaders['Authorization'] = req.headers['authorization'];
    }

    // Read raw body for non-GET requests
    const bodyOptions =
      req.method !== 'GET' && req.method !== 'HEAD'
        ? { body: JSON.stringify(req.body) }
        : {};

    const response = await fetch(fullUrl, {
      method: req.method,
      headers: forwardHeaders,
      ...bodyOptions,
    });

    // Copy status and forward response
    res.status(response.status);
    const contentType = response.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);

    const data = await response.text();
    res.send(data);
  } catch (err) {
    console.error(`Proxy error → ${fullUrl}:`, err);
    res.status(502).json({ error: 'Bad Gateway', detail: err.message });
  }
}
