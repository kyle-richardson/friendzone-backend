const express = require("express");
const configureMiddleware = require("./server-middleware.js");

const usersRouter = require("../users/users_router");

const server = express();
configureMiddleware(server);

server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "API running" });
});

module.exports = server;
