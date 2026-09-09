# Multi-stage production Dockerfile for BloodBridge
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
COPY shared ./shared

# Install dependencies
RUN npm run install --prefix server
RUN npm run install --prefix client

# Copy application source
COPY server ./server
COPY client ./client
COPY docs ./docs

# Generate Prisma client and build both apps
WORKDIR /app/server
RUN npx prisma generate
RUN npm run build

WORKDIR /app/client
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/server/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/prisma ./prisma
COPY --from=builder /app/client/dist ./client-dist
COPY --from=builder /app/shared ./shared

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "dist/index.js"]
