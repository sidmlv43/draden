const mongoose = require("mongoose");

const connectDb = (database) => {
  return mongoose
    .connect(database)
    .then(console.log("connection established with database 👍"))
    .catch((error) => console.log("error connecting to database 👎"));
};

module.exports = connectDb;
