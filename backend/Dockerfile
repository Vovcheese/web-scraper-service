FROM node:14.0.0

WORKDIR /usr/src/app

RUN ["mkdir", "/usr/src/app/views"]

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install -g pm2
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4050

ENTRYPOINT pm2 start dist/app.js && pm2 logs
