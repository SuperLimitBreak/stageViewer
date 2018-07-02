FROM node:9-alpine

WORKDIR /stageViewer

COPY package.json package.json
RUN npm install && npm cache clean

ENTRYPOINT [ "npm", "run" ]
CMD [ "--help" ]
