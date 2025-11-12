const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController.js');


router.post('/addReview/:productId', reviewController.addReview);


router.get('/getReviews/:productId', reviewController.getReviewsByProduct);

router.post('/getFilterRating/:productId', reviewController.getFilterratingByProduct);


module.exports = router;
