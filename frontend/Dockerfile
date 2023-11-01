# Stage 1: Build the application
FROM node:latest as build

WORKDIR /var/lib/jenkins/workspace/AM_Frontend_UAT_Service/
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm i --save-dev @types/jquery  # Install the type definitions for jQuery
RUN npm run build

# Stage 2: Serve the built app with a lightweight HTTP server
FROM nginx

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built app from the previous stage to Nginx default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
