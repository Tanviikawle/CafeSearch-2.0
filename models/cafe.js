const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url:String,
    filename:String,
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const CafeSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates:{
            type:[Number],
            required:true
        },
    },
    seats: String,
    description: String,
    location: String,
    has_sockets: Boolean,
    has_wifi: Boolean,
    has_toilet: Boolean,
    can_take_calls: Boolean,
    author: {
        type: Schema.Types.ObjectId,
        ref:'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
})

CafeSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Cafe', CafeSchema)