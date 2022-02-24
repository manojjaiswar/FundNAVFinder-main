const express = require("express");
const app = express();
const cors = require("cors");
const corsMiddleware = require("./cors")
const PORT = 4000;
const mongoose = require("mongoose");
const router = require('./auth')
var bodyParser = require('body-parser')
var dotenv = require('dotenv')
dotenv.config();
var db = require('./db')

app.options('*', corsMiddleware);
app.use(corsMiddleware)

mongoose
  .connect(db.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected'))
  .catch(err => console.log(err));

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("Connection with MongoDB was successful");
});

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

app.use("/", router);