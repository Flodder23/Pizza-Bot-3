FROM node:latest

COPY . .

RUN npm install

CMD node deploy-commands && node index