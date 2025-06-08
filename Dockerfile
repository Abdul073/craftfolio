# ================================
# 1. Install dependencies
# ================================
FROM node:20-alpine3.18 AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ================================
# 2. Build the app
# ================================
FROM node:20-alpine3.18 AS builder
WORKDIR /app

# Copy installed deps and app code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# ================================
# 3. Production image
# ================================
FROM node:20-alpine3.18 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies (optional, if your app needs them)
# COPY package.json package-lock.json ./
# RUN npm ci --omit=dev

# Copy only what's needed for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# ⚠️ Don't run `npx prisma generate` here again — it's already done during build stage
# ❌ RUN npx prisma generate

# If you have a production-only .env, copy that too (optional)
COPY .env .env

EXPOSE 3000
CMD ["npm", "start"]
