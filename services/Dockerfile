# Phase 2: Hardened, Non-Root Container for Node.js 22 LTS Microservice
# Multi-stage build ensuring zero build dependencies or package managers in runtime image

FROM node:22-alpine AS runtime

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
