FROM node:14-alpine
WORKDIR /usr/src/app

RUN npm install -global pm2
RUN npm install -global lerna

COPY . .
RUN npm run install:prod

RUN npm uninstall -global lerna

EXPOSE 8281-8284

CMD [ "pm2-runtime", "pm2.json" ]

