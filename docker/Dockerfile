FROM node:0.10.45

RUN apt-get update && \
    apt-get install -y ruby2.1-dev rubygems

RUN gem install sass --version "=3.4.8"
RUN gem install compass --version "=1.0.1"
RUN npm install -g bower grunt-cli

WORKDIR /var/www/unleash

CMD npm start
