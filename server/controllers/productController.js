
const product = require('../model/productsModel.js');

exports.addProduct = (req, res) => {
    try {
        const { title, price, description, category, image } = req.body;

        const newProduct = new product({
            title,
            price,
            description,
            category,
            image
        });
        newProduct.save()
            .then(() => {
                res.status(201).json({ success: true, message: 'Product added successfully' });
            })
            .catch((error) => {
                res.status(500).json({ success: false, message: 'Error adding product', error });
            });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding product', error });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await product.find({});
        if (products) {
            res.json({ success: true, products });
        } else {
            res.status(404).send({ success: false, message: 'No Products Found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving products', error });
    }
};

exports.getProductById = (req, res) => {
    try {
        const { id } = req.params;
        product.findById(id)
            .then((prod) => {
                if (prod) {
                    res.json({ success: true, product: prod });
                } else {
                    res.status(404).json({ success: false, message: 'Product not found' });
                }
            })
            .catch((error) => {
                res.status(500).json({ success: false, message: 'Error retrieving product', error });
            });
    } catch (error) {
        res.status(500).json({success:false, message: 'Error retrieving product', error});
    }
};

exports.deleteProduct = (req, res) => {
    try {
        const { id } = req.params;
        product.findByIdAndDelete(id)
            .then(() => {
                res.json({ success: true, message: 'Product deleted successfully' });
            })
            .catch((error) => {
                res.status(500).json({ success: false, message: 'Error deleting product', error });
            });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting product', error });
    }
};


    exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = {};
  const allowedFields = ['title', 'price', 'description', 'category', 'image', 'discountPercentage', 'discountEndTime','quantity'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  try {
    const updatedProduct = await product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error });
  }
};

