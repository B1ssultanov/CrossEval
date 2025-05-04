FROM php:8.1.17-fpm-alpine

RUN apt-get update && apt-get install -y tzdata \
  && ln -snf /usr/share/zoneinfo/Asia/Almaty /etc/localtime \
  && echo "Asia/Almaty" > /etc/timezone

ADD ./php/www.conf /usr/local/etc/php-fpm.d/

RUN addgroup -g 1000 laravel && adduser -G laravel -g laravel -s /bin/sh -D laravel

RUN mkdir -p /var/www/html

RUN chown laravel:laravel /var/www/html

WORKDIR /var/www/html

RUN docker-php-ext-install pdo pdo_mysql
