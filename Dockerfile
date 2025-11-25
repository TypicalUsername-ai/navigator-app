FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM nginx:alpine
#COPY ./package.json package-lock.json /app/
#COPY --from=production-dependencies-env /app/node_modules /app/node_modules
#COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/build/client /usr/share/nginx/html
#WORKDIR /app
#COPY /app /usr/share/nginx/html
RUN echo 'server { \
        listen 5173; \
        root /usr/share/nginx/html; \
        index index.html; \
        location / { \
            try_files $uri $uri/ /index.html; \
        } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
