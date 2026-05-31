import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
  plugins: [
    react(),
    {
      name: 'qwen-ai-help-api',
      configureServer(server) {
        server.middlewares.use('/api/ai-help', async (req, res) => {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          try {
            const body = await readRequestBody(req);
            const payload = JSON.parse(body || '{}') as {
              question?: string;
              context?: string;
              history?: Array<{ role: 'user' | 'assistant'; content: string }>;
            };

            if (!payload.question?.trim()) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Question is required' }));
              return;
            }

            const apiKey = env.QWEN_API_KEY;

            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'QWEN_API_KEY is not configured on the server.',
              }));
              return;
            }

            const baseUrl = env.QWEN_BASE_URL ?? 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
            const model = env.QWEN_MODEL ?? 'qwen-plus';
            const messages = [
              {
                role: 'system',
                content: [
                  'You are an AI help bot for a student training app.',
                  'Help students understand the current step without doing all of the work for them.',
                  'Start with a short hint, ask one clarifying question when useful, and reveal the full answer only if the student asks.',
                  'Keep replies concise, friendly, and focused on the current step.',
                ].join(' '),
              },
              {
                role: 'user',
                content: `Current app context:\n${payload.context || 'No extra context provided.'}`,
              },
              ...(payload.history ?? []).slice(-8),
              {
                role: 'user',
                content: payload.question.trim(),
              },
            ];

            const qwenResponse = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model,
                messages,
                temperature: 0.35,
                max_tokens: 450,
              }),
            });

            const data = await qwenResponse.json() as {
              choices?: Array<{ message?: { content?: string } }>;
              error?: { message?: string };
            };

            if (!qwenResponse.ok) {
              res.statusCode = qwenResponse.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: data.error?.message ?? 'Qwen request failed.',
              }));
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              answer: data.choices?.[0]?.message?.content ?? 'I could not generate a response.',
            }));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: error instanceof Error ? error.message : 'Unexpected server error',
            }));
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ['leaflet', 'react-leaflet'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  };
});

function readRequestBody(req: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}
