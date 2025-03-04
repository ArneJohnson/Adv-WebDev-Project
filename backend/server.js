require('dotenv').config();
const express = require('express');
const path = require('path');
const ModelClass = require('./models/model'); 
const cors = require('cors');
const app = express();
const model = new ModelClass();
const port = 3000;  

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

model.initDb().then(() => model.setupDb());

app.get(['/', '/stores'], (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/stores', async (req, res) => {
    try {
        const stores = await model.getAllStores(); 
        res.json(stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ error: 'Database error' });
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
        res.json({ message: `${storeid} was deleted` });
    } catch (error) {
        res.status(404).json({ error: `Store ${storeid} not found` });
    }
});

app.put('/store', async (req, res) => {
    const updatedStore = req.body;

    try {
        await model.updateStore(updatedStore);
        res.json({ message: `Store ${updatedStore.id} was updated` });
    } catch (error) {
        res.status(404).json({ error: `Store ${updatedStore.id} not found` });
    }
});

app.post('/addStore', async (req, res) => {
    const newStore = req.body;

    try {
        await model.addStore(newStore);
        res.json({ message: 'New store was added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add new store' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});