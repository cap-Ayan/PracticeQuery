const express = require('express');

const{addProduct, getProducts, getProductById, deleteProduct,updateProduct}= require('../controllers/productController.js');


const router = express.Router();

router.get('/getProducts', getProducts);
router.get('/getProductById/:id', getProductById);
router.post('/addProduct', addProduct);
router.delete('/deleteProduct/:id', deleteProduct);
router.put('/updateProduct/:id', updateProduct);


module.exports = router;

