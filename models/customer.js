var mongoose = require("mongoose");
// const validator = require("validator");

var Customer = mongoose.model("Customer", {
  cust_name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  cust_email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
    // validate: {
    //   validator: validator.isEmail,
    //   message: "{VALUE} is not a valid email"
    // }
  },
  cust_password: {
    type: String,
    require: true,
    minlength: 6
  },
  cust_address: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  cust_city: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {
  Customer
};
