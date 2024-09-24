const mongoose = require('mongoose');
const Joi = require('joi')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
});

const categoryJoiSchema = Joi.object({
    name: Joi.string().min(3).max(100).required()
});

function validateCategory(category) {
    return categoryJoiSchema.validate(category);
}

module.exports = {
    categoryModel: mongoose.model('category', categorySchema),
    validateCategory,
};
