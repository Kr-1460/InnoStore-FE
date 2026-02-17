FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build -- --output-mode=static --no-server

RUN set -e; \
  B="/app/dist/InnoStore-FE"; \
  mkdir -p /app/out; \
  if [ -f "$B/browser/index.html" ]; then cp -r "$B/browser/." /app/out/; \
  elif [ -f "$B/index.html" ]; then cp -r "$B/." /app/out/; rm -rf /app/out/server; \
  else echo "No index.html in $B or $B/browser"; ls -laR "$B"; exit 1; fi

FROM nginx:alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/out/ /usr/share/nginx/html/
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
