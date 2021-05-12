FROM node:14

WORKDIR /

COPY package*.json ./

RUN npm ci --only=production

COPY /src .

EXPOSE 3000
CMD [ "node", "index.js" ]