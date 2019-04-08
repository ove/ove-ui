FROM node:10-alpine
WORKDIR /usr/src/app

RUN npm install -global pm2
RUN npm install -global lerna

COPY . .
RUN npm run install:prod

EXPOSE 8281

CMD [ "pm2-runtime", "pm2.json" ]

