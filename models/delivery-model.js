const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    deliveryBoy: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
        default: 'Pending',
        required: true
    },
    trackingURL: {
        type: String,
        match: /^https?:\/\/[^\s$.?#].[^\s]*$/,
        required: false
    },
    estimateDeliveryTime: {
        type: Number,
        required: true,
        min: 0
    }
});


const deliveryJoiSchema = Joi.object({
    order: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('Invalid order ID');
        }
        return value;
    }).required(),
    deliveryBoy: Joi.string().min(3).max(100).required(),
    status: Joi.string().valid('Pending', 'In Transit', 'Delivered', 'Cancelled').required(),
    trackingURL: Joi.string().uri().optional(),
    estimateDeliveryTime: Joi.number().min(0).required()
});

function validateDelivery(delivery) {
    return deliveryJoiSchema.validate(delivery);
}


module.exports = {
    deliveryModel: mongoose.model('delivery', deliverySchema),
    validateDelivery,
};
