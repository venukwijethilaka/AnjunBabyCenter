# Complete Data Fetching Issues - Root Causes & Solutions

## 🔴 Critical Issues Found & Fixed

### 1. **Missing DATABASE_URL in Prisma Schema** [CRITICAL]
**Location**: `server/prisma/schema.prisma` (Line 6-7)
**Issue**: 
```
datasource db {
  provider = "postgresql"
  // ❌ NO URL SPECIFIED - Database connection fails
}
```
**Fix**: Added missing `url = env("DATABASE_URL")`
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ✅ NOW WORKS
}
```
**Impact**: Without this, Prisma cannot connect to PostgreSQL database, causing all API calls to fail

---

### 2. **Wrong Port in Server Dockerfile** [CRITICAL]
**Location**: `server/Dockerfile` (Line 35)
**Issue**: 
```
EXPOSE 5001  # ❌ Server runs on 8000, not 5001
```
**Fix**: Changed to `EXPOSE 8000`
**Impact**: While EXPOSE is just documentation, the mismatch causes confusion

---

### 3. **Missing Source Files in Docker Production Image** [CRITICAL]
**Location**: `server/Dockerfile` (production stage)
**Issue**: The production image didn't copy essential source files
```dockerfile
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
# ❌ MISSING: src/, generated/, tsconfig.json, prisma.ts, prisma.config.ts
```
**Fix**: Added all necessary copies:
```dockerfile
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/prisma.ts ./
COPY --from=builder /app/prisma.config.ts ./
```
**Impact**: Without source files, the app cannot run at all

---

### 4. **Missing curl in Docker for Health Checks** [IMPORTANT]
**Location**: `server/Dockerfile` (Line 28)
**Issue**: Health checks use `curl` but it's not installed
```dockerfile
RUN apk add --no-cache openssl  # ❌ curl missing
```
**Fix**: Added curl
```dockerfile
RUN apk add --no-cache openssl curl  # ✅ Both installed
```
**Impact**: Health checks fail, client doesn't wait for server to be ready

---

### 5. **Docker Network Isolation - localhost Issue** [CRITICAL]
**Location**: `client/.env.local`
**Issue**: 
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
Inside Docker, `localhost` refers to the client container itself, not the server

**Fix**: Changed to service name
```
NEXT_PUBLIC_API_BASE_URL=http://anjun_baby_server:8000
```
**Impact**: Client cannot connect to server API in Docker environment

---

### 6. **Incomplete Docker Compose Configuration** [IMPORTANT]
**Location**: Root `docker-compose.yml`
**Issues**:
- Didn't exist (services ran independently)
- No service dependencies defined
- No health checks coordination

**Fix**: Created comprehensive root-level docker-compose.yml with:
- Proper service orchestration
- Health check for server startup
- `depends_on` with `service_healthy` condition
- Explicit network definition
- Correct environment variables

---

## 📋 Files Changed

| File | Changes |
|------|---------|
| `server/prisma/schema.prisma` | Added `url = env("DATABASE_URL")` |
| `server/Dockerfile` | 1) Fixed EXPOSE port 2) Added curl 3) Added missing file copies |
| `client/.env.local` | Changed URL from `localhost` to `anjun_baby_server` |
| `docker-compose.yml` | Created new root-level file |
| `server/docker-compose.yml` | Added health check |
| `client/docker-compose.yml` | Updated for consistency |

---

## 🧪 How to Test

### Step 1: Clean Everything
```bash
cd d:\ASLIIT\Y2S2\PPA\Project\ABC\AnjunBabyCenter
docker system prune -af
docker-compose down -v
```

### Step 2: Build & Run
```bash
docker-compose up --build
```

### Step 3: Verify Server
```bash
# In another terminal
curl http://localhost:8000/products
# Should return: { "message": "Products fetched successfully", "data": [...] }

curl http://localhost:8000/categories
# Should return: { "message": "Categories retrieved successfully", "data": [...] }
```

### Step 4: Check Client
- Open: http://localhost:3000 (client page)
- Open: http://localhost:3000/admin (admin page)
- Check browser console (F12) - NO fetch errors should appear
- Products and Categories should load on both pages

### Step 5: Monitor Logs
```bash
# Server logs
docker logs anjun_baby_server

# Client logs
docker logs anjun_baby_client

# Follow logs in real-time
docker-compose logs -f
```

---

## ✅ Verification Checklist

- [ ] Prisma schema has `url = env("DATABASE_URL")`
- [ ] Server Dockerfile has `EXPOSE 8000`
- [ ] Server Dockerfile includes all source files in COPY commands
- [ ] curl is installed in server container
- [ ] Client .env.local has `NEXT_PUBLIC_API_BASE_URL=http://anjun_baby_server:8000`
- [ ] Root docker-compose.yml exists with both services
- [ ] Both services are on same network (`anjun_network`)
- [ ] Server has health check
- [ ] Client depends_on server with service_healthy condition
- [ ] docker-compose up --build runs without errors
- [ ] http://localhost:8000/products returns JSON data
- [ ] http://localhost:3000 loads without console errors
- [ ] Admin panel loads and fetches products
- [ ] Client page loads and fetches products

---

## 🚀 Expected Result

After these fixes:
1. ✅ Server starts successfully and connects to PostgreSQL
2. ✅ Server API endpoints return data (`/products`, `/categories`)
3. ✅ Client container waits for server health check
4. ✅ Client can reach server API using Docker service name
5. ✅ Admin page shows products and categories
6. ✅ Client page shows products and categories
7. ✅ No "Failed to fetch" errors in console
