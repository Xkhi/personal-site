FROM node

WORKDIR /src/app/

COPY *.json ./

RUN npm install

COPY *.js ./
ADD views ./views
ADD public ./public

EXPOSE 3000

ENTRYPOINT node calc.js
