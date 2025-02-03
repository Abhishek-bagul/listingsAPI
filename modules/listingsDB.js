const mongoose = require('mongoose');
const Listing = require('./listingSchema');

let isConnected = false;

const initialize = (connectionString) => {
    return new Promise((resolve, reject) => {
        if (isConnected) return resolve();

        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                isConnected = true;
                resolve();
            })
            .catch(err => reject(err));
    });
};

const addListing = (data) => {
    return new Listing(data).save();
};

const getListings = (page, perPage, name) => {
    let query = name ? { name: new RegExp(name, 'i') } : {};
    return Listing.find(query).skip((page - 1) * perPage).limit(perPage).exec();
};

const getListingById = (id) => {
    return Listing.findById(id).exec();
};

const updateListing = (id, data) => {
    return Listing.findByIdAndUpdate(id, data, { new: true }).exec();
};

const deleteListing = (id) => {
    return Listing.findByIdAndDelete(id).exec();
};

module.exports = { initialize, addListing, getListings, getListingById, updateListing, deleteListing };
