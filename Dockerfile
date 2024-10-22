# Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Install production dependencies
FROM node:20-alpine AS deps-production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY src/ src/
COPY tsconfig*.json ./
COPY package.json yarn.lock ./
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Production image
FROM node:20-alpine AS runner
ENV NODE_ENV=production
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock ./
COPY --from=deps-production /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["yarn", "start:prod"]
