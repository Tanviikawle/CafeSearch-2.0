const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html');

const extension = (joi) =>({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML' : '{{#label}} must not be include HTML!'
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean = sanitizeHTML(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean !== value) return helpers.error('string.escapeHTML',{ value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.cafeSchema =  Joi.object({
    cafe: Joi.object({
        title : Joi.string().required().escapeHTML(),
        seats : Joi.string().required().escapeHTML(),
        // image : Joi.string().required(),
        location : Joi.string().required().escapeHTML(),
        description : Joi.string().required().escapeHTML(),
        has_sockets: Joi.boolean().required(),
        has_wifi: Joi.boolean().required(),
        has_toilet: Joi.boolean().required(),
        can_take_calls: Joi.boolean().required(),
    }).required(),
    deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML(),
    }).required()
})