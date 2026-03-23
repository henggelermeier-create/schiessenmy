FROM nginx:1.27-alpine

COPY public/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN test -f /usr/share/nginx/html/index.html

EXPOSE 80
