# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies for building
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build args → env vars for Next.js public values
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ARG NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
ENV NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=${NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
ARG NEXT_PUBLIC_IMAGEKIT_URL
ENV NEXT_PUBLIC_IMAGEKIT_URL=${NEXT_PUBLIC_IMAGEKIT_URL}
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the Next.js app (generates .next/standalone)
RUN npm run build

# ─── Production stage ──────────────────────────────────────────────────────────
# Use a minimal image — standalone output bundles its own Node server
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache ca-certificates

# Copy ONLY the standalone output (self-contained, no node_modules needed)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Fix permission denied error when Next.js tries to create or access the cache layer
RUN mkdir -p /app/.next/cache && chown -R node:node /app/.next

# Switch to non-root user
USER node

# Run the bundled Next.js server directly — no npm overhead
CMD ["node", "server.js"]