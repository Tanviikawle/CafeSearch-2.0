const axios = require('axios');

const Cafe = require('../models/cafe');
const { cloudinary } = require('../cloudinary');
const LOCATIONIQ_END_POINT = 'https://api.locationiq.com/v1/search/structured';

const obj = {
    key: process.env.LOCATIONIQ_KEY,
    format:'json',
    q:'',
}

// geometry:{type:{type: 'Point',},coordinates:{type:[lat,lon]}};

const cafeLoc = async(req,res)=>{
    try {
      const response = await axios.get(LOCATIONIQ_END_POINT,{params:obj});
      const { lat , lon } = response.data[0]

      const geo_object = {type: 'Point',coordinates:[]};
      geo_object.coordinates.push(lon);
      geo_object.coordinates.push(lat);
    //   console.log(geo_object)
      return geo_object;
    } catch (error) {
      console.error(error);
    }
  }

module.exports.index = async(req,res)=>{
    const cafes = await Cafe.find({});
    res.render('cafes/index', {cafes})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('cafes/new');
}

module.exports.createCafe = async (req,res,next)=>{
    const cafe = new Cafe(req.body.cafe);
    obj.q = req.body.cafe.location,
    cafe.images = req.files.map(f => ({url: f.path, filename:f.filename}));
    cafe.author = req.user._id;
    const result = await cafeLoc();
    cafe.geometry = result;

    await cafe.save();
    console.log(cafe);
    req.flash('success','Successfully added a new cafe!')
    res.redirect(`/cafes/${cafe._id}`) 
}

module.exports.showCafe = async(req,res)=>{
    const cafe = await Cafe.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!cafe){
        req.flash('error','Cannot find that cafe!')
        return res.redirect('/cafes')
    }
    res.render('cafes/show',{cafe});
}

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const cafe =  await Cafe.findById(id)
    if(!cafe){
        req.flash('error','Cannot find that cafe!')
        return res.redirect('/cafes')
    }

    res.render('cafes/edit',{cafe})
}

module.exports.updateCafe = async(req,res)=>{
    const {id} = req.params;
    const cafe = await Cafe.findByIdAndUpdate(id,{...req.body.cafe});
    const imgs = req.files.map(f => ({url: f.path, filename:f.filename}));
    cafe.images.push(...imgs);
    await cafe.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await cafe.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated a cafe!')
    res.redirect(`/cafes/${cafe.id}`)
}

module.exports.deleteCafe = async(req,res)=>{
    const {id} = req.params;
    await Cafe.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the cafe!')
    res.redirect('/cafes');
}