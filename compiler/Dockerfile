# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies including OpenJDK
RUN apk update && \
    apk add --no-cache \
    g++ \
    openjdk11-jdk \
    python3

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the application
CMD ["node", "server.js"]
