# Build Angular app
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build -- --configuration production

# Serve with nginx
FROM nginx:alpine

# Copy built Angular app
COPY --from=build /app/dist/seed-mapper /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]