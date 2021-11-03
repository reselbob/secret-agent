FROM node:8.9-alpine
USER root
COPY index.js .
COPY package.json .
RUN npm install --only-production
EXPOSE 3050
CMD ["node", "index.js"]