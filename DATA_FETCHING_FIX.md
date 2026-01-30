# Data Fetching Issues - Root Cause Analysis & Solutions

## Problems Identified:

### 1. **Docker Network Isolation Issue** ❌
**Problem:** The client was configured with `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
- Inside Docker containers, `localhost` refers to the container itself, NOT the host machine or other containers
- The client container cannot reach the server through `localhost:8000`

**Solution:** Changed to use the Docker service name `http://anjun_baby_server:8000`

### 2. **Missing Coordinated Docker Compose** ❌
**Problem:** Client and Server had separate docker-compose.yml files without proper network coordination
- Both used the same network name but ran independently
- No health check to ensure server is ready before client connects

**Solution:** Created a root-level docker-compose.yml that:
- Orchestrates both services
- Uses `depends_on` with health check
- Explicitly passes the correct API URL as environment variable
- Ensures both containers are on the same bridge network

### 3. **Environment Variable Not Being Passed in Docker** ❌
**Problem:** Client Dockerfile didn't ensure the environment variable was set during build/runtime
- Next.js needs `NEXT_PUBLIC_API_BASE_URL` at build time OR runtime

**Solution:** Updated docker-compose files to explicitly set the environment variable

---

## Files Modified:

### 1. `/client/.env.local`
```
NEXT_PUBLIC_API_BASE_URL=http://anjun_baby_server:8000
```

### 2. Created `/docker-compose.yml` (Root Level)
Orchestrates both services with proper networking and health checks

### 3. Updated `/server/docker-compose.yml`
Added health check to verify server is running

### 4. Updated `/client/docker-compose.yml`
- Added explicit `NEXT_PUBLIC_API_BASE_URL` environment variable
- Set `version: '3.8'` for consistency

---

## How to Test:

### Option A: Using Root docker-compose.yml (RECOMMENDED)
```bash
# From project root directory
docker-compose down  # Clean up any existing containers
docker-compose up --build

# Test the API
# Open browser: http://localhost:3000
# Check browser console for any fetch errors
# Open browser: http://localhost:8000/products (should return JSON)
```

### Option B: Using Individual docker-compose files
```bash
# Terminal 1: Start server
cd server
docker-compose down
docker-compose up --build

# Terminal 2: Start client
cd client
docker-compose down
docker-compose up --build

# Test same as above
```

### Option C: Local Development (No Docker)
```bash
# Terminal 1: Start server
cd server
npm install
npm run dev

# Terminal 2: Start client  
cd client
npm install
npm run dev

# Update client/.env.local to:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## Key Networking Concepts:

### Inside Docker Containers:
- ✅ `http://anjun_baby_server:8000` - Works (service name on shared network)
- ✅ `http://localhost:8000` - Works ONLY for accessing the container itself
- ❌ `http://localhost:8000` - Does NOT work to reach another container

### Docker Network Resolution:
- Docker DNS resolves service names (from docker-compose.yml) to container IPs
- `anjun_baby_server` resolves to the server container's internal IP
- Both containers are on `anjun_network` (bridge network)

---

## Verification Checklist:

- [ ] Root docker-compose.yml created
- [ ] Client `.env.local` updated with `http://anjun_baby_server:8000`
- [ ] Both docker-compose files use same network name
- [ ] Server exposes port 8000 correctly
- [ ] Client exposes port 3000 correctly
- [ ] CORS is enabled on server (✓ Already done)
- [ ] Routes exist: `/products` and `/categories` (✓ Already done)
- [ ] Prisma client is generated in Docker (✓ Already done)
- [ ] Database connection string is valid (check `.env`)

---

## If Issues Persist:

1. **Check Docker logs:**
   ```bash
   docker logs anjun_baby_server
   docker logs anjun_baby_client
   ```

2. **Test connectivity inside containers:**
   ```bash
   docker exec anjun_baby_client curl http://anjun_baby_server:8000/products
   ```

3. **Verify environment variables:**
   ```bash
   docker exec anjun_baby_client printenv | grep NEXT_PUBLIC_API_BASE_URL
   ```

4. **Check database connection:**
   ```bash
   docker logs anjun_baby_server | grep "connected\|error"
   ```
