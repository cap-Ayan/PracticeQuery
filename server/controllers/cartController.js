const Cart = require('../model/CartModel.js');
const Product = require('../model/productsModel.js');

exports.addToCart = async (req, res) => {
    console.log(req.body)
    const { productId, quantity } = req.body;
    const userId = req.user._id; 

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        

        let cartItem = await Cart.findOne({ user: userId, product: productId });

        if (cartItem) {
            if (product.quantity <cartItem.quantity +quantity) {
                console.log(product.quantity)
            return res.status(400).json({ success: false, message: 'Not enough product in stock' });
        }
         
            cartItem.quantity += quantity;
            await cartItem.save();
            res.status(200).json({ success: true, message: 'Product quantity updated in cart', cartItem });
        } else {
            cartItem = new Cart({
                user: userId,
                product: productId,
                quantity: quantity
            });
            await cartItem.save();
            
            res.status(201).json({ success: true, message: 'Product added to cart', cartItem });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

exports.removeFromCart = async (req, res) => {
    const { cartItemId } = req.params;
    const userId = req.user._id;

    try {
        const cartItem = await Cart.findOneAndDelete({ product: cartItemId, user: userId });

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Cart item not found or not authorized' });
        }

        res.status(200).json({ success: true, message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
};

exports.getCartItems = async (req, res) => {
    const userId = req.user._id;

    try {
        const cartItems = await Cart.find({ user: userId }).populate('product');
        res.status(200).json({ success: true, cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }

}

exports.checkOut =  async (req, res) => {
  try {
    const { cartItems } = req.body; 
    // cartItems = [{ productId, quantity }, ...]

    // Use Promise.all to update all products in parallel
    await Promise.all(
      cartItems.map(async (item) => {
       const product = await Product.findByIdAndUpdate(
          item.product._id,
          { $inc: { quantity: -item.quantity } }, // decrement
          { new: true }
        );

        console.log(product)
      })
    );

    res.status(200).json({ success: true, message: 'Order placed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false,message: 'Checkout failed' });
  }
};

exports.removeAll = async (req, res) => {
    const userId = req.user._id;
    try {
      const cartItems = await Cart.deleteMany({ user: userId });
      res.status(200).json({ success: true, message: 'All items removed from cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
