FROM nginx:latest

# Copy the static files to the nginx directory
COPY static /usr/share/nginx/html/static

# Copy the nginx configuration file to the nginx directory
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Openssl: Well it's already installed in the nginx image (debian based)
RUN mkdir -p /etc/nginx/ssl/
RUN openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/inno_nginx.key \
    -out /etc/nginx/ssl/inno_nginx.crt \
    -subj "/C=AU/ST=Victoria/L=Melbourne/O=Swinburne/CN=localhost"

# C = Country
# ST = State
# L = Location
# O = Organization
# CN = Common Name
# <- This created inno_nginx.key and inno_nginx.crt in the /etc/nginx/ssl/ directory
