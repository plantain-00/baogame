FROM node:latest
WORKDIR /app
ADD . /app
RUN yarn --production
EXPOSE 8030
CMD ["node","dist/app.js"]
