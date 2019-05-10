var mongoose = require("mongoose");

var Product = mongoose.model("Product", {
    product_title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    product_description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    product_image: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    product_rating: {
        type: Number,
        require: true
    },
    product_price: {
        type: Number,
        required: true
    }
});

module.exports = {
    Product
};
