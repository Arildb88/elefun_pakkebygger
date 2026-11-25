# Elefun Pakkebygger – prototype image (production build, port 8787)
# Debian-based image, not alpine: workerd/sharp need glibc.
FROM node:22-bookworm-slim

ENV CI=true \
    NODE_ENV=production \
    WRANGLER_SEND_METRICS=false

WORKDIR /app
RUN corepack enable

# Install deps first so this layer is cached until the lockfile changes.
# NODE_ENV is overridden here because the build needs devDependencies (vite, vinext).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN NODE_ENV=development corepack pnpm install --frozen-lockfile

COPY . .
RUN node scripts/run-framework.mjs build

EXPOSE 8787
# The build targets Cloudflare Workers, so it is served locally with wrangler (workerd),
# same as `pnpm start` but bound to 0.0.0.0 so the NAS reverse proxy can reach it.
CMD ["node", "--import", "./scripts/sites-env.mjs", "./node_modules/wrangler/bin/wrangler.js", "dev", \
     "--config", "dist/server/wrangler.json", "--local", "--persist-to", ".wrangler/state", \
     "--ip", "0.0.0.0", "--port", "8787", "--inspector-port", "0"]
