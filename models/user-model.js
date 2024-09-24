const mongoose = require('mongoose');
const Joi = require('joi');

const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    zip: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
});

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        password: {
            type: String,
            minlength: 6
        },
        phone: {
            type: Number,
            minlength: 10,
            maxlength: 15
        },
        addresses: {
            type: [AddressSchema],
            validate: [arrayLimit, '{PATH} exceeds the limit of 5']
        }
    },
    { timestamps: true }
);

function arrayLimit(val) {
    return val.length <= 5;
}

// joi validation


const addressJoiSchema = Joi.object({
    state: Joi.string().min(2).max(100).required(),
    zip: Joi.string().min(3).max(20).required(),
    city: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(5).max(255).required()
});

const userJoiSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    addresses: Joi.array().items(addressJoiSchema).max(5)
});

function validateUser(user) {
    return userJoiSchema.validate(user);
}

module.exports = {
    userModel: mongoose.model('user', userSchema),
    validateUser,
}