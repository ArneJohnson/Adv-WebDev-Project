# Use official Node.js image as a base
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY  backend /app/backend 

EXPOSE 3001

CMD ["node", "backend/server.js"]
