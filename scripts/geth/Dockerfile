FROM ethereum/client-go:v1.10.1

ARG ACCOUNT_PASSWORD

COPY genesis.json /tmp

RUN echo ${ACCOUNT_PASSWORD} > /tmp/password \
    && ACCOUNT_ADDRESS=$(echo ${ACCOUNT_PASSWORD} | geth account new --password /dev/stdin | grep -oE '0x[a-fA-F0-9]{40}') \
    && sed -i "s/\"alloc\": {}/\"alloc\": {\"${ACCOUNT_ADDRESS}\": {\"balance\": \"1000000000000000000000000000\"}}/" /tmp/genesis.json \
    && geth init /tmp/genesis.json \
    && rm -f ~/.ethereum/geth/nodekey /tmp/password

ENTRYPOINT ["geth"]