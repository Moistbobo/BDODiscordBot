FROM node:10

WORKDIR /usr/src/Bobobot

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]