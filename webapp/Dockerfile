FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the static site files into the nginx container
COPY .output/public /usr/share/nginx/html

# Expose the port nginx is running on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
