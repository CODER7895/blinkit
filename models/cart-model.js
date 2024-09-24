const mongoose = require('mongoose');
const Joi = require('joi');

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
});


const cartJoiSchema = Joi.object({
    user: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('Invalid user ID');
        }
        return value;
    }).required(),
    products: Joi.array().items(Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('Invalid product ID');
        }
        return value;
    })).min(1).required(),
    totalPrice: Joi.number().min(0).required()
});

function validateCart(cart) {
    return cartJoiSchema.validate(cart);
}

module.exports = {
    cartModel: mongoose.model('cart', cartSchema),
    validateCart,
};

