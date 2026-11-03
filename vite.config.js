import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Local dev server middleware for /api/* Serverless Functions
 * Provides 100% parity with Vercel serverless execution during local development.
 */
function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) return next();

        const host = req.headers.host || 'localhost:5173';
        const url = new URL(req.url, `http://${host}`);
        const routeName = url.pathname.replace(/^\/api\/?/, '').split('/')[0] || 'health';

        try {
          const apiFilePath = resolve(__dirname, `api/${routeName}.js`);
          const mod = await server.ssrLoadModule(apiFilePath);
          const handler = mod.default || mod;

          // Read body if method has payload
          if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }
            try {
              req.body = JSON.parse(body);
            } catch {
              req.body = body;
            }
          }

          // Add Express/Vercel helpers if not already present
          if (!res.status) {
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
          }
          if (!res.json) {
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
          }

          await handler(req, res);
        } catch (err) {
          console.error(`[API Dev Error] ${req.url}:`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    watch: {
      ignored: ['**/public/content/**', '**/frames/**']
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
      },
    },
  },
});
