# Use an official Node.js runtime as a parent image
# Using alpine for a smaller image size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker's layer caching
COPY package*.json ./

# Install app dependencies inside the container
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the application
CMD [ "node", "index.js" ]