require("dotenv").config();
const express = require("express");
const path = require("path");
const databaseConnection = require("./config/database");

const app = express();

//Set up database;
databaseConnection();
//Middleware setup;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is working fine");
});
//Setup Routers;
app.use("/api/user", require("./router/api/user"));

//Listening PORT;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `The Emoji Wiki server has been started on localhost port: ${PORT}`
  );
});
