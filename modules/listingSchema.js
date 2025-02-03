const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    location: String,
    available: Boolean
});

module.exports = mongoose.model('Listing', ListingSchema);
