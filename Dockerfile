# Build stage
FROM node:22-slim AS builder
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_DOWNLOAD=true
COPY app/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY app/. ./
RUN npm prune --production && rm -rf /root/.npm /tmp/* /var/lib/apt/lists/*

# Runtime stage
FROM node:22-slim AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/server ./server
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/views ./views
COPY --from=builder /usr/src/app/package*.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+process.env.PORT,(res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "server/server.js"]