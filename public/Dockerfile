# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy the static files from the local `public` directory to Nginx's web server directory
COPY ./ /usr/share/nginx/html

# Expose port 80 (Nginx default port)
EXPOSE 80

# Start Nginx server when the container runs
CMD ["nginx", "-g", "daemon off;"]
