var mongoose = require("mongoose");

var url = "mongodb://localhost:27017/Ecommerse";

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || url).then(
  () => {
    console.log("connected to database");
  },
  () => {
    console.log("error connecting to database");
  }
);

module.exports = {
  mongoose
};
