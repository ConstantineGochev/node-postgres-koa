FROM node:alpine
WORKDIR '/app'
RUN mkdir -p uploads
COPY ./package.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
