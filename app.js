require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const ModelClass = require('./public/js/model');
const model = new ModelClass();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.get('/stores', async (req, res) => {
    try {
        const stores = await model.getAllStores();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
});

app.get('/storesFiltered', async (req, res) => {
    try {
        const stores = await model.getAllStores();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
});

app.get('/store', async (req, res) => {
    const { id: storeid } = req.query;

    if (isNaN(storeid)) {
        return res.status(400).json({ error: 'Invalid store id' });
    }

    try {
        const store = await model.getStoreById(storeid);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch store' });
    }
});

app.delete('/store', async (req, res) => {
    const { id: storeid } = req.query;

    try {
        await model.deleteStore(storeid);
        return res.json({ message: `${storeid} was deleted` });
    } catch (error) {
        return res.status(404).json({ error: `Store ${storeid} not found` });
    }
});

app.put('/store', async (req, res) => {
    const updatedStore = req.body;

    try {
        await model.updateStore(updatedStore);
        return res.json({ message: `Store ${updatedStore.id} was updated` });
    } catch (error) {
        return res.status(404).json({ error: `Store ${updatedStore.id} not found` });
    }
});

app.post('/addStore', async (req, res) => {
    const newStore = req.body; 

    try {
        await model.addStore(newStore);
        return res.json({ message: 'New store was added' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to add new store' });
    }
});

// Start server after initializing the database
const server = async () => {
    try {
        await model.initDb();
        await model.setupDb();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
};

server();
