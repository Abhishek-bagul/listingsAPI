const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    location: String,
    available: Boolean
});

module.exports = listingSchema;
