const express = require('express');
const router = express.Router({mergeParams: true});
const reviews = require('../controllers/reviews')

const catchAsync = require('../utils/catchAsync');
// const {reviewSchema} = require('../schemas.js')
const ExpressError = require('../utils/ExpressError');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')

const Cafe = require('../models/cafe');
const Review = require('../models/review')

router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;