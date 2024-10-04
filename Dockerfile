FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY app.js .
COPY routes ./routes
COPY src ./src
COPY claim.html .
EXPOSE 12345
CMD ["npm", "start"]
