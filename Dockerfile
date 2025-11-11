
# Multi-stage production image for FinlyzerApp (Financial Ratio Analyzer)
# - Uses official Node 22 slim image
# - Installs production dependencies only
# - Runs the server as non-root `node` user

FROM node:22-slim AS base

# Set working directory
WORKDIR /usr/src/app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifest first (for better caching). Use npm install when package-lock.json
# is not present because `npm ci` requires a lockfile. `npm install --omit=dev` will
# install production deps only with modern npm versions.
COPY app/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy application source
COPY app/. ./

# Fix permissions so non-root `node` user can run the app
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Simple healthcheck using Node's http client
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD node -e "require('http').get('http://localhost:'+process.env.PORT,(res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Default command
CMD ["node", "server/server.js"]

