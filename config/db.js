const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/config.env" });

const connectDB = async (cb) => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    console.log("DB connected");
    let server;
    cb(server);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;