const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    method: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
        required: true
    },
    transactionID: {
        type: String,
        required: true,
        unique: true
    }
});


const paymentJoiSchema = Joi.object({
    order: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message('Invalid order ID');
        }
        return value;
    }).required(),
    amount: Joi.number().min(0).required(),
    method: Joi.string().valid('Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer').required(),
    status: Joi.string().valid('Pending', 'Completed', 'Failed', 'Refunded').required(),
    transactionID: Joi.string().required()
});

function validatePayment(payment) {
    return paymentJoiSchema.validate(payment);
}


module.exports = {
    paymentModel: mongoose.model('payment', paymentSchema),
    validatePayment,
};

