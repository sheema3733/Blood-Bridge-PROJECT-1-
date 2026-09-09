# BloodBridge — Production Deployment & DevOps Architecture

## 1. Overview
BloodBridge is engineered as a stateless API service paired with a high-performance Single Page Application (SPA), connected via persistent WebSockets and backed by transactional relational storage.

---

## 2. Containerized Deployment (Docker)

### Build and Run with Docker Compose
```bash
# Build the production container image
docker compose build

# Start the BloodBridge platform in detached mode
docker compose up -d

# Inspect running healthcheck
docker compose ps
```

The container includes:
- Automated multi-stage Node.js build with pruned production dependencies
- Embedded SQLite transactional data persistence mapped to a Docker volume
- Built-in HTTP health check polling `/api/health` every 30 seconds

---

## 3. Reverse Proxy Architecture (NGINX)

In high-availability production deployments, place NGINX in front of BloodBridge to terminate SSL/TLS and forward WebSocket connections:

```nginx
server {
    listen 443 ssl http2;
    server_name bloodbridge.org;

    ssl_certificate /etc/letsencrypt/live/bloodbridge.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bloodbridge.org/privkey.pem;

    # API and Real-Time WebSocket Proxy
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. Production Security Checklist
- [x] Rotate `JWT_SECRET` with a cryptographically secure 256-bit key.
- [x] Verify `.env` is never checked into Git.
- [x] Configure HTTPS certificates (Let's Encrypt / Certbot).
- [x] Verify rate limiting thresholds on auth endpoints.
- [x] Enable automated SQLite or PostgreSQL database snapshot backups.
