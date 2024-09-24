const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    image: {
        data: Buffer,
        contentType: String,
    }
});

const productJoiSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().min(3).max(50).required(),
    stock: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.object({
        data: Joi.binary().required(),
        contentType: Joi.string().required()
    }).required() // Image is now an object with `data` and `contentType`
});

function validateProduct(product) {
    return productJoiSchema.validate(product);
}

// Register the model with a capitalized name
const productModel = mongoose.model('Product', productSchema);

module.exports = {
    productModel,
    validateProduct,    
};
