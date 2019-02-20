FROM node:11.8-alpine

ENV TOPICO=meu-topico
ENV HOST=IP
ENV PORTA=9092

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "start" ]

