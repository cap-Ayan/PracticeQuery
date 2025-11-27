const { Schema, model } = require('mongoose');

const productSchema = new Schema({


  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    rate: {
      type: Number,

    },
    count: {
      type: Number,

    }
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  discountEndTime: {
    type: Date,
    default: null,
  },
  quantity: {
    type: Number,
    default: 2,
  },



});

const Product = model('Product', productSchema);

module.exports = Product;