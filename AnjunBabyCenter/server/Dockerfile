# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install system dependencies needed for Prisma/OpenSSL
RUN apk add --no-cache openssl ca-certificates

COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript to JavaScript in /dist
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl curl ca-certificates

# Copy only package files to install strictly production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
RUN npm ci --omit=dev

# Copy generated prisma, db schema, and compiled code
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/dist ./dist

EXPOSE 8000
# Switch to non-root user
USER node

# Start the compiled JS server natively
CMD ["node", "dist/src/index.js"]