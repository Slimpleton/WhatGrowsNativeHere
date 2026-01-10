# =========================
# Build stage
# =========================
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build browser + server bundles
RUN npm run build:ssr

# =========================
# Runtime stage
# =========================
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copy built dist
COPY --from=build /app/dist ./dist
# Copy node modules (only prod)
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

# Copy i18n assets into the server folder explicitly
COPY --from=build /app/dist/what-grows-native-here/browser/assets/i18n ./dist/what-grows-native-here/browser/assets/i18n
COPY --from=build /app/dist/what-grows-native-here/browser/assets/i18n ./dist/what-grows-native-here/server/assets/i18n

EXPOSE 4000

# Start SSR server
CMD ["node", "dist/what-grows-native-here/server/server.mjs"]
