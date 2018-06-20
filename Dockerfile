FROM node:carbon
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
# Expose the binded port
EXPOSE 8080
# Run the application
CMD ["npm", "start"]
