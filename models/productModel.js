const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type : String,
    required : true,

  },
   
  category: {
    type : String,
    required : true,

  },
  price: {
    type: Number,
    required: true,
  },
  image: {
  type: String,
  required: true
},

  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

  
}, {
  timestamps: true,
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
