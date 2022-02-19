FROM node:16-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "run", "start"]
# RUN npm run build

# FROM nginx
# COPY --from=build /app/build /usr/share/nginx/html
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# # COPY ./nginx.conf /etc/nginx/templates/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]