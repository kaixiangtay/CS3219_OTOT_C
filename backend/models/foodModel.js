var mongoose = require('mongoose');

// Setup schema
var foodSchema = mongoose.Schema({
    foodname: {
        type: String,
        required: true,
    },
    expirydate: {
        type: String,
        required: true,
    },
    person: String,
    phone: String,
});

// Export food model
var food = module.exports = mongoose.model('foodlists', foodSchema);

module.exports.get = function (callback, limit) {
    food.find(callback).limit(limit);
}
