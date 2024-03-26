const express = require('express');
const route = express.Router()


const controller = require('../Controllers/Contact');

// API
route.post('/api/AddContact', controller.AddContact);
route.delete('/api/deleteC/:id', controller.deleteC);
route.patch('/api/update/:id', controller.update);
route.get('/api/findID/:id', controller.findID);
route.get('/api/find', controller.findAll);


module.exports = route