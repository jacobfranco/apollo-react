FROM node:22.11-alpine AS build
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
ARG NODE_ENV=production
ARG BACKEND_URL=https://api.apollo.now
ARG STREAMING_URL=wss://api.apollo.now
ENV IMGIX_DOMAIN=apollo-414916088.imgix.net
RUN yarn build

FROM nginx:stable-alpine
EXPOSE 80
ENV PORT=80
ENV FALLBACK_PORT=4444
ENV BACKEND_URL=https://api.apollo.now
ENV STREAMING_URL=wss://api.apollo.now
ENV IMGIX_DOMAIN=apollo-414916088.imgix.net
ENV CSP=
COPY installation/docker.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html