FROM nginx:1.9

ADD dist /usr/share/nginx/html
ADD docker/vhost.conf /etc/nginx/conf.d/default.conf
