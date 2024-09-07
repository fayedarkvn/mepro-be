# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Production image
FROM node:20-alpine AS runner
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["yarn", "start:prod"]
