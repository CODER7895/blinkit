const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
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
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
        required: true
    }
});



const orderJoiSchema = Joi.object({
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
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string().min(5).max(255).required(),
    status: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('Invalid payment ID');
        }
        return value;
    }).required(),
    delivery: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('Invalid delivery ID');
        }
        return value;
    }).required()
});

function validateOrder(order) {
    return orderJoiSchema.validate(order);
}



module.exports = {
    orderModel: mongoose.model('order', orderSchema),
    validateOrder,
};


