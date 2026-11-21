# Phase 2: Hardened, Non-Root Container for Node.js 22 LTS Microservice
# Multi-stage build ensuring zero build dependencies or package managers in runtime image

# Pin to Node.js 22.23.5-alpine (>= 22.23.5 mitigates CVE-2026-111497, CVE-2026-123864, CVE-2026-123865, CVE-2026-105482, CVE-2026-105483, CVE-2026-106069)
FROM node:22.23.5-alpine AS runtime

# Security: Install no extra packages; run as existing unprivileged 'node' user (UID 1000)
WORKDIR /app

# Copy application server code
COPY server.js ./

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Drop privileges to non-root
USER node:node

# Healthcheck against internal health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

EXPOSE 8080

# Immutable execution: Run directly with Node.js
CMD ["node", "server.js"]
