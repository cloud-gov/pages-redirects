FROM nginx:1.11.10

COPY out/nginx.docker.conf /etc/nginx/nginx.conf
