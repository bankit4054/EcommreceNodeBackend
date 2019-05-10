var mongoose = require("mongoose");

var Sale = mongoose.model("Sales", {
    fk_userid: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    fk_productid: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    quantity: {
        type: Number,
        require: true
    },
});

module.exports = {
    Sale
};
