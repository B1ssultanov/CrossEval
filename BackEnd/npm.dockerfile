FROM node:20-alpine

WORKDIR /app

COPY ../FrontEnd/package*.json ./

RUN npm install

COPY ../FrontEnd .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
