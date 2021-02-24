FROM node:14.0.0

WORKDIR /dist

COPY package*.json ./

RUN npm install -g pm2
RUN npm install --production
RUN npm run build

COPY . ./app

EXPOSE 7070

ENTRYPOINT pm2 start app.js && pm2 logs
