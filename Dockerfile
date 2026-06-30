# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache friendly)
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Replace default config with hardened config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Grant the non-root nginx user write access to runtime directories
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d

# Drop to non-root
USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
