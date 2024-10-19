# Build Stage
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# React build-time args
ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_BACKEND_URL

# Build
RUN npm run build

# Final Stage
FROM nginx:alpine

# Nginx Configs
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start App
CMD ["nginx", "-g", "daemon off;"]
