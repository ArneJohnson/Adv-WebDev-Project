require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const storesJson = require('./stores.json');
const ModelClass = require('./model');
const model = new ModelClass();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/stores', async (req, res) => {
    const stores = await model.getAllStores();
    res.json(storesJson);
    });

app.get('storesFiltered', async (req, res) => {
    const stores = await model.getAllStores();
    res.json(storesJson);
    });

app.get('/store', async (req, res) => {
    const {id: storeid} = req.query;

   if (isNaN(storeid)) {
       res.status(400).json({error: 'Invalid store id'});
       return;
   }
   const store = await model.getStoreById(storeid);
   res.json(store);
});

// remind me to talk about error handling with you and whether we want to write store {id} was deleted or refer to sth else ;)
app.delete('/store', async (req, res) => {
    const {id: storeid} = req.query.id;

    try {
        await model.deleteStore(storeid);
        return res.json({message: '${storeid} was deleted'});
    }  catch (error) {
        return res.status(404).json({error: ' Store X not found'});
    } 
});

app.put('/store', async (req, res) => {
    const updatedStore = req.body;

    try {
        await model.updateStore(updatedStore);
        return res.json({message: 'Store X was updated'});
    }
    catch (error) {
        return res.status(404).json({error: 'Store X not found'});
    }
});

app.post('/newstore', async (req, res) => {
    const newStore = req.body;
    try {
        await model.addStore(newStore);
        return res.json({message: 'New store was added'});
    } catch (error) {
        return res.status(500).json({error: 'Failed to add new store'});
    }
});

const server = async () => {
    await Model.initDb();
    await Model.setupDb();

    app.listen(port, () => {
        console.log('Server is running on port ${port}');
    });
};

server();