const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://127.0.0.1:27017/login-tut");

connect //promise returned by mongoose.connect
  .then(() => {
    console.log("Database successfully connected");
  })
  .catch((error) => {
    console.log("Database cannot be conected", error);
  });

const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//collection part
const collection = new mongoose.model("users", LoginSchema); //mongoose.model allows you to define a schema that represents the structure of documents within a MongoDB collection.

module.exports = collection;
