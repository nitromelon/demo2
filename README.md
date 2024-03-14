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
