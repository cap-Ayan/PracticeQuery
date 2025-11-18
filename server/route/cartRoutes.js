const authanticateUser= require('../middlewares/authMiddleware.js');

const{addToCart,removeFromCart,getCartItems}= require('../controllers/cartController.js');


const express = require('express');
const router = express.Router();

router.post('/addToCart', authanticateUser, addToCart);
router.delete('/removeFromCart/:cartItemId', authanticateUser, removeFromCart);
router.get('/getCartItems', authanticateUser, getCartItems);


module.exports = router;