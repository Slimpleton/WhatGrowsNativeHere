# =========================
# Build stage
# =========================
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build BOTH browser + server bundles
RUN npm run build:ssr

# =========================
# Runtime stage (Node SSR)
# =========================
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Only copy what is needed at runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm ci --omit=dev

EXPOSE 4000

# Angular Universal entry point
CMD ["node", "dist/what-grows-native-here/server/server.mjs"]
