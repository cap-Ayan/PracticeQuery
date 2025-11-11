const express = require('express');

const{addProduct, getProducts, getProductById, deleteProduct}= require('../controllers/productController.js');


const router = express.Router();

router.get('/getProducts', getProducts);
router.get('/getProductById/:id', getProductById);
router.post('/addProduct', addProduct);
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;

