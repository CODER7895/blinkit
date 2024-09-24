const mongoose = require('mongoose');
const Joi = require('joi');


const adminSchema = mongoose.Schema({
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
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin',
        required: true
    }
});

const adminJoiSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'superadmin').required()
});

function validateAdmin(admin) {
    return adminJoiSchema.validate(admin);
}

module.exports = {
    adminModel: mongoose.model('admin', adminSchema),
    validateAdmin,
};
