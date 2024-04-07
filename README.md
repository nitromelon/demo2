# Khi nào dùng docker

- Khi test xong local, bản docker là bản prod cuối cùng
- Run command: `npm run docker:build:start` để tạo và chạy nhanh.
- Hiện tại test xong phải xóa thủ công hehe.

## Very important note

The below readme is outdated. I will update it soon.

## Temp note

- Upload file flow:
  - Post request to express.
  - Put the file into Kafka to process, immediately return the response to client as the file is being processed, before that send to user's database the id url of the file.
  - Send the file from kafka to mongodb. Done
  - User will see the file as soon as the file is processed.

## Architecture

- Backend:
  - I built backend with fluent interface design pattern, with modules and services like domain driven design. There are three main modules:
    - Backend: which is the main module. It contains middlewares config, route with path + controller. Each controllers follow CRUD pattern strictly as defined in `src/request/CRUD.ts`.
    - Database: This is singleton class which is responsible for connecting to database. I use `prisma` as ORM to connect to `mongodb`. And cache public / popular data in redis.
    - Web3: This is also a singleton class which is responsible for connecting to geth. I use `ethers.js` to interact with smart contract. To compile and deploy and test locally, I use `hardhat`.
  - The strong point is that it's very easy to add new features as this is work like a lego. Don't want Database, or Web3? Just comment it out. However, the response's code might not be 200, but 500.
  - It can handle almost error without crashing the server. One thing that crashed my backend is when I spammed PUT request to get money from admin's wallet.
  - Thin wrapper around technologies. Strict flow but flexible to add new features.

## How to run

- This backend is combination of nginx (http2 self made ssl), express (typescript version), prisma, mongodb, redis, kafka, auth0, hardhat, and geth so you have to setup lots of things before run actual code.
- Actually first you have to install docker and nodejs, those are essential.
- Then you run `npm install` to install all the dependencies.
- To run script (on vscode), you have to run `pip install requirements.txt`. But I think you first have to create a virtual environment and activate it.
- Make your own `.env` file:
  - `BACKEND_PORT`: Port of the backend
  - `FRONTEND_PORT`: Port of the frontend
  - `GETH_PORT`: Port of the geth
  - `DATABASE_HOST`: Host of mongodb
  - `DATABASE_PORT`: Port of mongodb
  - `DATABASE_PORT_1`: Port of mongodb replica set 1
  - `DATABASE_PORT_2`: Port of mongodb replica set 2
  - `MONGO_USER`: Username of mongodb
  - `MONGO_PASSWORD`: Password of mongodb
  - `MONGO_DATABASE`: Database of mongodb
  - `DATABASE_URL`: URL of mongodb
  - `AUTH0_AUDIENCE`: Audience of auth0
  - `AUTH0_ISSUERBASEURL`: Issuer base url of auth0
  - `AUTH0_TOKENSIGNINGAL`: Token signing algorithm of auth0
  - `GETH_RPC_URL`: RPC URL of geth
  - `GETH_NETWORK_ID`: Network ID of geth
  - `GETH_ACCOUNT_PASSWORD`: Account password of geth
  - (later then) <- This is generated by the script
    - `GETH_ACCOUNT_PUBLIC_KEY`: Account public key of geth
    - `GETH_ACCOUNT_PRIVATE_KEY`: Account private key of geth
    - `GETH_SMART_CONTRACT_ACCOUNT_PUBLIC_ADDRESS`: Smart contract account public address of geth

- There are folders: scripts, hardhat
  - run first half of the script in `setup_geth.ipynb`
  - `scripts`
    - open folder `geth` inside
      - run `docker-compose up --build --wait` to start geth
      - Note that you may experience some lagging because geth miner is running.
      - Now run the second half of the script in `setup_geth.ipynb`
    - open folder `mongo`
      - run `docker-compose up --build --wait` to start mongodb
      - run `setup_mongo.ipynb` to setup mongodb
      - then head to root folder, run `npx prisma db push` to push the schema to mongodb
        - You can also run `npx prisma db push --force-reset` if you feel furious like me (it will nuke the existing data)
    - open folder `source`. This is our data source.
      - Run `analyze_data.ipynb` to process the data. Remember to read the comments in the script because you may need to wait for eternity till the data is processed (~30 min).
      - As the result, you can see bunch of images in folder, copy them to `nginx/static` folder.
      - Copy that json data to `root/src/app/upload_content` folder. Actually I still keep it in this repo so you can skip this step.
        - Uncomment the line 58 or such to upload fresh data to mongodb.
    - run `setup_nginx.ipynb` to setup nginx. Remember to read the comments in the script.
    - run `setup_redis.ipynb` to setup redis
    - ok, so `cd` command to go to `root/hardhat`.
    - run `npx hardhat compile` to compile the smart contract.
      - There is script file in `root/hardhat/hardhat_notebook.ipynb` for you to run. However I have encountered some problems in the first script block so I have to run it manually.
      - For the last block, I think you should run it manually to see the result.
    - `cd` to `root` and run `npm run dev` to start the backend.
    - If you want to upload fresh data to mongodb:
      - Make a POST request to `<url>:<port>/api/upload_content` and wait for the response (200).

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
