FROM node:22-alpine
WORKDIR opt/api/
COPY ./ ./
RUN npm install
CMD ["npm", "run", "start:prod"]