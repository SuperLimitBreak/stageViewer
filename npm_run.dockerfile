FROM node:alpine

WORKDIR /stageViewer

COPY package.json package.json
RUN npm install && npm cache clean --force

ENTRYPOINT [ "npm", "run" ]
CMD [ "--help" ]
