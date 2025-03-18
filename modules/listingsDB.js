const mongoose = require("mongoose");
const listingSchema = require("./listingSchema");

module.exports = class ListingsDB {
  constructor() {
    this.Listing = null;
  }

  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(connectionString);

      db.once('error', (err) => {
        reject(err);
      });
      db.once('open', () => {
        this.Listing = db.model("listing", listingSchema);
        resolve();
      });
    });
  }

  async addNewListing(data) {
    const newListing = new this.Listing(data);
    await newListing.save();
    return newListing;
  }

  getAllListings(page, perPage, name) {
    let findBy = name ? { "name": { "$regex": name, "$options": "i" } } : {}

    if (+page && +perPage) {
      return this.Listing.find(findBy, {reviews: 0}).sort({ number_of_reviews: -1 }).skip((page - 1) * +perPage).limit(+perPage).exec();
    }

    return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
  }

  async getListingById(id) {
    try {
      // Check if ID is valid and convert to ObjectId if necessary
      if (!mongoose.isValidObjectId(id)) {
        throw new Error('Invalid ID format');
      }
  
      const objectId = new mongoose.Types.ObjectId(id); // Always convert to ObjectId
      return await this.Listing.findOne({ _id: objectId }).exec();
    } catch (err) {
      throw new Error(`Invalid ID format: ${err.message}`);
    }
  }

  async updateListingById(data, id) {
    try {
      const objectId = mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;
      return await this.Listing.updateOne({ _id: objectId }, { $set: data }).exec();
    } catch (err) {
      throw new Error(`Invalid ID format: ${err.message}`);
    }
  }

  async deleteListingById(id) {
    try {
      const objectId = mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;
      return await this.Listing.deleteOne({ _id: objectId }).exec();
    } catch (err) {
      throw new Error(`Invalid ID format: ${err.message}`);
    }
  }
};
