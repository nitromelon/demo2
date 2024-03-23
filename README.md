# Khi nào dùng docker

- Khi test xong local, bản docker là bản prod cuối cùng
- Run command: `npm run docker:build:start` để tạo và chạy nhanh.
- Hiện tại test xong phải xóa thủ công hehe.

## Note

- Note chạy database (mongodb):
  - Chạy file scripts/setup.ipynb để tạo username password và gán database.
- Note chạy geth:
  - Chưa có lol!!!
- Geth stores and executes your Solidity code, while Ethers.js interacts with it from your backend code. Hardhat is a separate development tool that helps you build and test your contracts before deployment.
- Upload file flow:
  - Post request to express.
  - Put the file into Kafka to process, immediately return the response to client as the file is being processed, before that send to user's database the id url of the file.
  - Send the file from kafka to mongodb. Done
  - User will see the file as soon as the file is processed.
- Install npm
  - `npm install --legacy-peer-deps`
  - This is because of the peer dependencies of the package "hardhat".
  - And yes, everything from now will be `npm install {stuff} --legacy-peer-deps`. Sorry for the inconvenience.

## Todo

- [ ] Apply [redis](https://github.com/Asjas/prisma-redis-middleware) into prisma
- [ ] Read this [go ethereum](https://ethereum.stackexchange.com/questions/136894/how-to-connect-hardhat-to-my-own-private-geth-chain)

## API

- wallet/
  - POST /api/wallet: Create a new wallet
    - Result (201): { "address": "0x1234", "privateKey": "0x1234" }
  - GET /api/wallet/{wallet address}: Show wallet balance
    - Result (200): { "balance": 100 }
  - PUT /api/wallet/{wallet address}: Update wallet balance
    - Body: { "amount": 100 }
    - Result (204): No content

- wallet/transactions
  - POST /api/wallet/transactions: Send money from one wallet to another
    - Body: { "from": "0x1234", "to": "0x5678", "amount": 100 }
    - Result (200): Have content but unnecessary

- user
  - POST /api/user: Create a new user
    - Body: { "name": "John Doe", "email": "<abc@abc.com>" }
    - Result (201): { "id": 1, "sub": "id dinh danh", "name": "John Doe", "email": "<abc@abc.com>" }
  - GET /api/user/{id}: Get user by id
    - Result (200): { "id": 1, "sub": "id dinh danh", "name": "John Doe", "email": "<abc@abc.com>" }
