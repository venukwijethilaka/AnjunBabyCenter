# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Check for package files
COPY package.json package-lock.json* ./

# Use a cache mount to speed up npm and handle memory better
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

COPY . .

# Next.js 15+ needs more memory for building
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files for a smaller footprint
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Production install
RUN npm ci --omit=dev --legacy-peer-deps

EXPOSE 3000
CMD ["npm", "start"]