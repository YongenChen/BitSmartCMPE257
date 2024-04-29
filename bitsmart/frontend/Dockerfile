FROM node:lts-alpine as development
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
CMD ["npm", "start"]

FROM development as build
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/nginx /etc/nginx/templates
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/bitsmart/browser .
CMD ["nginx", "-g", "daemon off;"]
