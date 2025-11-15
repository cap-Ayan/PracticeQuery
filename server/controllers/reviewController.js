const Review = require('../model/reviewModel.js');

exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { user, rating, feedback } = req.body;

  try {
    const newReview = new Review({
      productId,
      user,
      rating,
      feedback
    });

    await newReview.save();
    res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getFilterratingByProduct = async (req, res) => {
  const { productId } = req.params;
  const {rating}=req.body;
  
  try {
    const reviews = await Review.find({ productId ,rating}).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, reviews: reviews });

    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }


}
