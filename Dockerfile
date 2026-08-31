# Build stage
FROM node:24-slim AS builder

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install system dependencies for Chromium / Playwright and OpenSSL for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    chromium \
    fonts-liberation \
    fonts-unifont \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev
RUN npx prisma generate

# Download Playwright Chromium binaries if needed in runtime
RUN npx playwright install chromium || true

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main"]
