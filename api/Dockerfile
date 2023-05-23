FROM node:16-slim

# Install nodemon
RUN npm install -g nodemon

# create root application folder
WORKDIR /app

COPY /node_modules /app/node_modules 
COPY /dist /app/dist

EXPOSE 8080

CMD [ "nodemon", "./dist/index.js" ]
