FROM node:14-alpine

RUN apk add --update g++ make py3-pip git && rm -rf /var/cache/apk/*
USER root

WORKDIR /usr/src/app
RUN mkdir ./packages

RUN for app in demo \launcher \preview \status; do mkdir "./packages/ove-ui-$app"; done
COPY ./packages/ove-ui-demo/package.json ./packages/ove-ui-demo
COPY ./packages/ove-ui-launcher/package.json ./packages/ove-ui-launcher
COPY ./packages/ove-ui-preview/package.json ./packages/ove-ui-preview
COPY ./packages/ove-ui-status/package.json ./packages/ove-ui-status

RUN npm --global config set user root

RUN npm install -global pm2
RUN npm install -global lerna@4.0.0

COPY package.json lerna.json ./
RUN npm run install:prod

COPY . .

RUN npm uninstall -global lerna
RUN apk del git g++ make py3-pip

EXPOSE 8281-8284

CMD [ "pm2-runtime", "pm2.json" ]

