# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install system dependencies needed for Prisma/OpenSSL
RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
# Install all dependencies including devDependencies for the build
# Change 'RUN npm ci' to include a higher timeout and a retry limit
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci

COPY . .

# Generate Prisma Client (Crucial step)
RUN npx prisma generate

# Build the app (if you have a build script)
# RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl curl

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/prisma.ts ./
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 8000

# Run generate again just in case for the specific runtime env, then start
CMD npx prisma generate && npx tsx src/index.ts