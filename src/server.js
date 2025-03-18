const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let items = [];

// Get all items
app.get('/items', (req, res) => {
    res.json(items);
});

// Get a single item by index
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0 && id < items.length) {
        res.json(items[id]);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Create a new item
app.post('/items', (req, res) => {
    const newItem = req.body;
    items.push(newItem);
    res.status(201).json(newItem);
});

// Update an item
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0 && id < items.length) {
        items[id] = req.body;
        res.json(items[id]);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Delete an item
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0 && id < items.length) {
        items.splice(id, 1);
        res.json({ message: 'Item deleted' });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
