# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Create the upload directory and set permissions
ENV UPLOAD_DIR=/srv/public-files
RUN mkdir -p ${UPLOAD_DIR} && chown -R node:node ${UPLOAD_DIR}

# Switch to non-root user for security
USER node

# Expose the server port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
