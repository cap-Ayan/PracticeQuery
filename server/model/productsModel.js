const {Schema, model} = require('mongoose');

const productSchema = new Schema({
   
    
    title:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    rating: {
      rate: {
        type: Number,
        
      },
      count: {
        type: Number,
        
      }
    }


});

const Product = model('Product', productSchema);

module.exports = Product;