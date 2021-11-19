FROM node:latest

EXPOSE 3000

RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim"]

# Install all the dependencies
WORKDIR /src
RUN npm init -y
RUN npm install express body-parser mysql nodemon 
RUN npm install bootstrap bootstrap-social font-awesome jquery @popperjs/core

# Actual code and stuff here
WORKDIR /src/app
# COPY . ./src/app




