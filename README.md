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

## How to run

- This backend is combination of express (typescript version), prisma, mongodb so you have to setup lots of things before run actual code.
- Actually first you have to install docker and nodejs, those are essential.
- Then you run `npm install` to install all the dependencies.
- To run script (on vscode), you have to run `pip install requirements.txt`. But I think you first have to create a virtual environment and activate it.
- Make your own `.env` file:
  - `BACKEND_PORT`: Port of the backend
  - `FRONTEND_PORT`: Port of the frontend
  - `DATABASE_HOST`: Host of mongodb
  - `DATABASE_PORT`: Port of mongodb
  - `DATABASE_PORT_1`: Port of mongodb replica set 1
  - `DATABASE_PORT_2`: Port of mongodb replica set 2
  - `MONGO_USER`: Username of mongodb
  - `MONGO_PASSWORD`: Password of mongodb
  - `MONGO_DATABASE`: Database of mongodb
  - `DATABASE_URL`: URL of mongodb

- Setup
  - `scripts`
    - open folder `mongo`
      - run `docker-compose up --build --wait` to start mongodb
      - run `setup_mongo.ipynb` to setup mongodb
      - then head to root folder, run `npx prisma db push` to push the schema to mongodb
        - You can also run `npx prisma db push --force-reset` if you feel furious like me (it will nuke the existing data)
    - run `setup_redis.ipynb` to setup redis (optional for caching)
    - `cd` to `root folder` and run `npm run dev` to start the backend.
