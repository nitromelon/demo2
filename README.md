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

- For all path:
  - Error code:
    - 500: Internal server error
    - 404: Not found

- wallet/
  - POST /api/wallet: Create a new wallet
    - Result (201): { "address": "0x1234", "privateKey": "0x1234" }
    - Result (401): { "error": "User not found" }
    - Result (404): { "error": "Wallet already exists" }

  - GET /api/wallet/{wallet address}: Show wallet balance
    - Result (200): { "balance": 100 }
    - Result (400): { "error": "Bad Request" }

  - PUT /api/wallet/{wallet address}: Update wallet balance
    - Body: { "amount": 100 }
    - Result (204): No content
    - Result (400): { "error": "Bad Request" }
    - Result (400): { "error": "Insufficient Funds" }
    - Result (401): { "error": "Unauthorized" }
    - Result (404): { "error": "User not found" }
    - Result (403): { "error": "Forbidden" }

- wallet/transactions
  - POST /api/wallet/transactions: Send money from one wallet to another
    - Body: { "from": "0x1234", "to": "0x5678", "amount": 100 }
    - Result (200): Have content but unnecessary
    - Result (400): { "error": "Bad Request" }

  - GET /api/wallet/transactions/{wallet address}: Show all transactions of a wallet
    - Result (200): { "transactions": [ { "from": "0x1234", "to": "0x5678", "amount": 100 } ] }
    - Result (400): { "error": "Bad Request" }
    - Result (404): { "error": "User not found" }
    - Result (401): { "error": "Unauthorized" }

- user/
  - POST /api/user: Create a new user
    - Body: { "name": "John Doe", "email": "<abc@abc.com>" }
    - Result (401): { "error": "Unauthorized" }
    - Result (201): { "id": 1, "sub": "id dinh danh", "name": "John Doe", "email": "<abc@abc.com>" }

  - GET /api/user/{id}: Get user by id
    - Result (200): { "id": 1, "sub": "id dinh danh", "name": "John Doe", "email": "<abc@abc.com>" }
    - Result (401): { "error": "Unauthorized" }
    - Result (404): { "error": "User not found" }

  - PUT /api/user/{id}: Update user by id
    - Body: {
        username: string;
        email: string;
      }
    - Result (401): { "error": "Unauthorized" }
    - Result (404): { "error": "User not found" }
    - Result (200): {
        id: string;
        sub: string;
        username: string;
        email: string;
        walletAddress: string; (rỗng là null, có là string)
      }
  
  - DELETE /api/user/{id}: Delete user by id
    - Result (401): { "error": "Unauthorized" }
    - Result (204): No content

- gallery/
  - POST /api/gallery: Get all gallery
    - Result (200): {
      categories: string[];
      header: {
        id: string;
        title: string;
        image: string;
        price: number;
        priceHistory: number[];
      }[];
      body: {
        category: string;
        data: {
            id: string;
            title: string;
            image: string;
            price: number;
            priceHistory: number[];
        }[];
      }[];
    }
  
  - GET /api/gallery/{category}: Get gallery by category
    - Result (200): {
      categories: string;
      header: {
        category: string;
        data: {
          id: string;
          title: string;
          image: string;
          price: number;
          priceHistory: number[];
        }[];
      };
    }
    - Result (400): { "error": "Bad Request" }

- gallery/:category
  - POST /api/gallery/:category/: Show count of products of a category as page
    - Result (200): { count: number; }
  - GET /api/gallery/:category/{page}: Get gallery by category and page
    - Result (200): {
      categories: string;
      header: {
        category: string;
        data: {
          id: string;
          title: string;
          image: string;
          price: number;
          priceHistory: number[];
        }[];
      };
    }
    - Result (400): { "error": "Bad Request" }

- product
  - GET /api/product/{product id}: Get product info
    - Result (200): {
      id: string;
      title: string;
      image: string;
      price: number;
      priceHistory: number[];
      ... many more;
      Category: {
        id: string;
        name: string;
      };
      Provider: {
        id: string;
        name: string;
      };
    }
    - Result (400): { "error": "Bad Request" }
  
  - PUT /api/product/{product id}: Buy product
    - Body: {
      private_key: string;
    }
    - Result (200): { "message": "Success" }
    - Result (400): { "error": "Bad Request" }
    - Result (401): { "error": "Unauthorized" }
    - Result (404): { "error": "User not found" }
    - Result (400): { "error": "User has no wallet address" }
    - Result (404): { "error": "Product not found" }
    - Result (400): { "error": "Insufficient balance" }
    - Result (400): { "error": "Product has been sold" }

- product/:product/related
  - POST /api/product/:product/related: Get related products
    - Result (200): {
      categories: string;
      header: {
        category: string;
        data: {
          id: string;
          title: string;
          image: string;
          price: number;
          priceHistory: number[];
        }[];
      };
    }
    - Result (400): { "error": "Bad Request" }
    - Result (404): { "error": "Product not found" }

### Extra note for API

You can open note.txt for more information about the API.
