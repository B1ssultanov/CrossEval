FROM node:20-alpine

WORKDIR /var/www/html

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
