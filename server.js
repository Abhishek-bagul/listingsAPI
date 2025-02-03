/********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Abhishek Vijay Bagul Student ID: 148451214 Date: 02/03/25
* Published URL: ___________________________________________________________
********************************************************************************/

const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Listing = require('./modules/listingSchema');
const ListingsDB = require('./modules/listingsDB.js');
const db = new ListingsDB();

dotenv.config();
app.use(cors());
app.use(express.json());

const HTTP_PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: "Welcome to Listings API" });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

app.post('/api/listings', async (req, res) => {
    try {
        const listing = await db.addListing(req.body);
        res.status(201).json(listing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/listings', async (req, res) => {
    let { page = 1, perPage = 5, name } = req.query;
    page = parseInt(page);
    perPage = parseInt(perPage);

    try {
        const listings = await db.getListings(page, perPage, name);
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/listings/:id', async (req, res) => {
    try {
        const listing = await db.getListingById(req.params.id);
        if (!listing) return res.status(404).json({ error: "Listing not found" });
        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/listings/:id', async (req, res) => {
    try {
        const updatedListing = await db.updateListing(req.params.id, req.body);
        if (!updatedListing) return res.status(404).json({ error: "Listing not found" });
        res.json(updatedListing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/listings/:id', async (req, res) => {
    try {
        await db.deleteListing(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});