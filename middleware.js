const {cafeSchema,reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Cafe = require('./models/cafe')
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        // console.log(req.session)
        req.flash('error','you must be signed in.');
        return  res.redirect('/login');
    }
    next();
}

module.exports.validateCafe = (req,res,next) => {
    const {error} = cafeSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else {
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const cafe = await Cafe.findById(id);
    if(!cafe.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/cafes/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/cafes/${id}`);
    }
    next();
}


module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

