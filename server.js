var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var cors = require('cors');
var formidable = require('formidable');

const storage = multer.diskStorage({
  destination: './data/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
}).single('image');

var { mongoose } = require("./db/mongoose");
var { Customer } = require("./models/customer");
var { Product } = require("./models/products");
var { Sale } = require("./models/sales");

const { ObjectID } = require("mongodb");

const port = process.env.PORT || 3000;

var app = express();
// app.use(bodyParser.json());

app.use(cors())

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// app.use(express.static('./'));

app.post("/insertUser", (req, res) => {
  var customer = new Customer({
    cust_name: req.body.name,
    cust_email: req.body.email,
    cust_password: req.body.password,
    cust_address: req.body.address,
    cust_city: req.body.city
  });

  customer.save().then(
    doc =>
      res.status(201).send({
        message: "user was created."
      }),
    e => {
      res.status(400).send(e);
    }
  );
});

app.post("/getUserDetail", (req, res) => {
  console.log('getUserDetail', req.body)

  Customer.findOne({ cust_email: req.body.email }).then(
    doc => {
      if (!doc) {
        return res.status(400).send({ message: "Invalid Credentials" });
      }
      if (doc.cust_password == req.body.password) {
        var user = {
          id: doc._id,
          name: doc.cust_name,
          email: doc.cust_email,
          address: doc.cust_address,
          city: doc.cust_city
        };
        res.status(200).send(user);
      }
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.post("/getProductList", (req, res) => {

  Product.find().then(
    doc => {
      if (!doc) {
        return res.status(400).send({ message: "no products found" });
      }
      var products = {products: []};
      for (var i = 0; i<doc.length; i++) {
        var product = {
          product_id: doc[i]._id,
          product_title: doc[i].product_title,
          product_description: doc[i].product_description,
          product_rating: doc[i].product_rating,
          product_price: doc[i].product_price,
          product_image: doc[i].product_image,
        }
        products.products.push(product);
      }
      res.status(200).send(products);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.post("/addToCart", (req, res) => {
  var sale = new Sale({
    fk_userid: req.body.userId,
    fk_productid: req.body.productId,
    quantity: req.body.quantity
  });

  sale.save().then(
    doc =>
      res.status(201).send({
        message: "Product Added"
      }),
    e => {
      res.status(400).send(e);
    }
  );
});

app.post("/getCartProducts", (req, res) => {

  Sale.find({fk_userid: req.body.userId}).then(
    async (doc) => {
      var products = [];
      for (var i = 0; i<doc.length; i++) {
        var product = {
          product_id: doc[i].fk_productid,
          product_title: doc[i].product_title,
          userid: doc[i].fk_userid,
          quantity: doc[i].quantity,
        }
        await Product.findOne({_id: product.product_id}).then(doc => {
          product.product_title = doc.product_title;
          product.product_price = doc.product_price;
          products.push(product);
        })
      }
      res.status(201).send({
        products
      })
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.post("/getProductDetail", (req, res) => {

  Product.findOne({_id: req.body.productId}).then(
    (doc) => {
      var product = {
        product_id: doc._id,
        product_title: doc.product_title,
        product_description: doc.product_description,
        product_rating: doc.product_rating,
        product_price: doc.product_price,
        product_image: doc.product_image,
      }
      res.status(200).send(product)
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.post("/removeFromCart", (req, res) => {

  Sale.findOneAndRemove({fk_productid: req.body.productId, fk_userid: req.body.userId}).then(
    () => {
      res.status(200).send({message: 'product removed'});
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.post("/updateUser", (req, res) => {

  Customer.findByIdAndUpdate(req.body.id, 
    {$set: {"cust_name": req.body.name, "cust_email":req.body.email, "cust_password": req.body.password, "cust_address": req.body.address, "cust_city": req.body.city} }).then(
    doc =>
      res.status(201).send({
        message: "user was updated."
      }),
    e => {
      res.status(400).send(e);
    }
  );
});
app.post("/updateQuantity", (req, res) => {

  Sale.findOneAndUpdate(
      {fk_productid: req.body.productId, fk_userid: req.body.userId},
      { $set: { "quantity" : req.body.quantity} }
    ).then(
    () => {
      res.status(200).send({message: 'product updated'});
    },
    e => {
      res.status(400).send(e);
    }
  );
});
app.post('/addReview', (req, res) => {
  console.log('addReview', req.body)
  var form = new formidable.IncomingForm();
  //form.uploadDir =  __dirname + '/data/';
  // res.send();
    form.parse(req, function(err, fields, files) {

      console.log(fields);
      console.log(files.image.name);
      files.image.path = __dirname + '/data/' + files.image.name;
      res.send(200);
    });

    form.on('fileBegin', function (name, file){
         file.path = __dirname + '/data/' + file.name;
         console.log('---')
    });

    form.on('file', function (name, file){
      //file.path = __dirname + '/data/' + file.name;
        console.log('Uploaded ' + file.name);
    });


  // upload(req, res, (err) => {
  //   if(err){
  //     console.log('failure');
  //   } else {
  //     console.log('success');
  //   }
  // });
});

app.listen(port, () => {
  console.log(`started on port ${port}`);
});

module.exports = {
  app
};
