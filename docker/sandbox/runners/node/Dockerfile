# Node.js + TypeScript runner
FROM node:20-alpine

# Install ts-node and typescript globally BEFORE security cleanup
RUN npm install -g ts-node typescript --no-fund --no-audit && \
    npm cache clean --force

# Security cleanup (keep npm since ts-node needs it at runtime via node_modules)
RUN apk del apk-tools

# Create non-root user
RUN adduser -D -u 1001 runner

USER runner
WORKDIR /sandbox
