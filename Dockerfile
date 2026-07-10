# Multi-stage Dockerfile for Houselink Frontend (Next.js)
FROM node:22-alpine AS base
WORKDIR /app

# --- Development Stage ---
FROM base AS development
COPY package*.json ./
RUN npm install --no-audit --no-fund && npm cache clean --force
# Prune unused native Next.js SWC compiler packages
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
    rm -rf node_modules/@next/swc-linux-x64-gnu; \
    rm -rf node_modules/@next/swc-linux-arm64-*; \
    elif [ "$ARCH" = "aarch64" ]; then \
    rm -rf node_modules/@next/swc-linux-arm64-gnu; \
    rm -rf node_modules/@next/swc-linux-x64-*; \
    fi
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Build Stage ---
FROM base AS builder
# Accept public API endpoints at build time so they are compiled into the client bundle
ARG NEXT_PUBLIC_WEB_API_URL=http://localhost:8080
ARG NEXT_PUBLIC_SITE_URL=http://localhost:8080
ENV NEXT_PUBLIC_WEB_API_URL=$NEXT_PUBLIC_WEB_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY package*.json ./
RUN npm install --no-audit --no-fund && npm cache clean --force

RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
    rm -rf node_modules/@next/swc-linux-x64-gnu; \
    rm -rf node_modules/@next/swc-linux-arm64-*; \
    elif [ "$ARCH" = "aarch64" ]; then \
    rm -rf node_modules/@next/swc-linux-arm64-gnu; \
    rm -rf node_modules/@next/swc-linux-x64-*; \
    fi
COPY . .
RUN npm run build

# --- Production Runtime Stage ---
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy minimal standalone build files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
