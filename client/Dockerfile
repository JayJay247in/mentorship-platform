# ---- Stage 1: The Builder ----
# Use a Node.js image to build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the React build script. This creates a 'build' folder with static assets.
RUN npm run build


# ---- Stage 2: The Server ----
# Use a lightweight Nginx image to serve the static files
FROM nginx:stable-alpine

# Copy the built React app from the 'builder' stage to Nginx's web server directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy our custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (the default Nginx port)
EXPOSE 80

# The default Nginx command starts the server, so we don't need a CMD.