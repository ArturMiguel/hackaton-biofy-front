ARG NODE_VERSION=16.13.1

FROM node:${NODE_VERSION}-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm i -f
COPY . .
RUN npm run build

FROM nginx:latest as prod
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/hackaton-biofy-front /usr/share/nginx/html