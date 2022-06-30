FROM node:16-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install --production
RUN npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# WORKDIR /app
# COPY ./gen-env.js .
# COPY .env .
# RUN apt update
# RUN apt install -y nodejs
# RUN apt install -y npm
# RUN npm install dotenv
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# CMD ["/bin/bash", "-c", "node gen-env.js && nginx -g \"daemon off;\""]