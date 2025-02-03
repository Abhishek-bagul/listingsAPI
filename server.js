/********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Abhishek Vijay Bagul Student ID: 148451214 Date: 02/03/25
* Published URL: https://listings-api-sand.vercel.app/
********************************************************************************/

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ListingsDB = require('./modules/listingsDB.js');
const db = new ListingsDB();

const app = express();
app.use(cors());
app.use(express.json());

const HTTP_PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

app.post('/api/listings', async (req, res) => {
    try {
        const newListing = await db.addNewListing(req.body);
        res.status(201).json(newListing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/listings', async (req, res) => {
    const { page, perPage, name } = req.query;
    try {
        const listings = await db.getAllListings(page, perPage, name);
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/listings/:id', async (req, res) => {
    try {
        const listing = await db.getListingById(req.params.id);
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).send({ error: 'Listing not found' });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.put('/api/listings/:id', async (req, res) => {
    try {
        const updatedListing = await db.updateListingById(req.body, req.params.id);
        if (updatedListing.modifiedCount === 0) {
            res.status(404).json({ error: 'Listing not found or not updated' });
        } else {
            res.json({ message: 'Listing updated successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/listings/:id', async (req, res) => {
    try {
        const result = await db.deleteListingById(req.params.id);
        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'Listing not found' });
        } else {
            res.status(204).send();
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log('Database initialization failed:', err);
});
