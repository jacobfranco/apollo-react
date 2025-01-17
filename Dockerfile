FROM node:22.11-alpine AS build
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
ARG NODE_ENV=production
ARG BACKEND_URL=https://api.apollo.now
ARG STREAMING_URL=wss://api.apollo.now
RUN yarn build

FROM nginx:stable-alpine
RUN apk add --no-cache apache2-utils
RUN htpasswd -cb /etc/nginx/.htpasswd admin 'Apollo420!'
EXPOSE 80
ENV PORT=80
ENV FALLBACK_PORT=4444
ENV BACKEND_URL=https://api.apollo.now
ENV STREAMING_URL=wss://api.apollo.now
ENV CSP=
COPY installation/docker.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html