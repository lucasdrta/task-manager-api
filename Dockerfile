FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS runner
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && \
    yarn add drizzle-kit --no-lockfile

COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY drizzle.config.ts ./
COPY src/db/schema ./src/db/schema
COPY scripts/docker-entrypoint.sh ./scripts/

RUN chmod +x scripts/docker-entrypoint.sh && \
    addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 3333

CMD ["sh", "scripts/docker-entrypoint.sh"]
