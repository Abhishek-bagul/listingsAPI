const mongoose = require('mongoose');
const Listing = require('./listingSchema');

class ListingsDB {
    constructor() {
        this.isConnected = false;
    }

    initialize(connectionString) {
        return new Promise((resolve, reject) => {
            if (this.isConnected) return resolve();

            mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => {
                    this.isConnected = true;
                    resolve();
                })
                .catch(err => reject(err));
        });
    }

    addListing(data) {
        return new Listing(data).save();
    }

    getListings(page, perPage, name) {
        let query = name ? { name: new RegExp(name, 'i') } : {};
        return Listing.find(query).skip((page - 1) * perPage).limit(perPage).exec();
    }

    getListingById(id) {
        return Listing.findById(id).exec();
    }

    updateListing(id, data) {
        return Listing.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    deleteListing(id) {
        return Listing.findByIdAndDelete(id).exec();
    }
}

module.exports = ListingsDB;
