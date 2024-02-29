// package
import express from "express";
import dotenv from "dotenv";
import InnoBE from "./request/request";
import Demo, { Demo2 } from "./app/demo";

dotenv.config();

// config env
const backendPort = process.env["BACKEND_PORT"] || "8080";
const fronendPort = process.env["FRONTEND_PORT"] || "3000";

InnoBE.create(
    express(),
    "0.0.0.0",
    parseInt(backendPort),
    parseInt(fronendPort)
)
    .config()
    .route("/demo", new Demo())
    .route("/demo/test", new Demo2())
    .catch()
    .start();
