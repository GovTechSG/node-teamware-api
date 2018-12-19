FROM node:11.3

WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/sandbox/package.json
COPY ./package-lock.json /usr/src/app/sandbox/package-lock.json


COPY ./package.json /usr/src/app/package.json
COPY ./package-lock.json /usr/src/app/package-lock.json



RUN cd /usr/src/app/sandbox && npm install && cd /usr/src/app && npm install

COPY . /usr/src/app

VOLUME /usr/src/app/tmp

EXPOSE 8080


CMD node /usr/src/app/bin/www.js
