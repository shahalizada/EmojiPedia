const mongoose = require("mongoose");
const config = require("config");
const db = config.get("MONGODB-URI");

const databaseConnection = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to ATLAS server");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = databaseConnection;
