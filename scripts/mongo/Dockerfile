FROM mongo

RUN openssl rand -base64 756 > /mongodb-keyfile
RUN chown mongodb:mongodb /mongodb-keyfile
RUN chmod 400 /mongodb-keyfile