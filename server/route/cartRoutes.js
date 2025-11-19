const authanticateUser= require('../middlewares/authMiddleware.js');

const{addToCart,removeFromCart,getCartItems,checkOut,removeAll}= require('../controllers/cartController.js');


const express = require('express');
const router = express.Router();

router.post('/addToCart', authanticateUser, addToCart);
router.delete('/removeFromCart/:cartItemId', authanticateUser, removeFromCart);
router.get('/getCartItems', authanticateUser, getCartItems);
router.post('/checkOut', authanticateUser, checkOut);
router.delete('/removeAll', authanticateUser, removeAll);




module.exports = router;