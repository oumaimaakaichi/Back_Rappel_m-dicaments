const express = require('express');
const route = express.Router()
const Contact=require('../Models/Contacts-Médecins')

const controller = require('../Controllers/Contact');
route.get('/contactsUtilisateur/:utilisateurId', async (req, res) => {
    try {
        const contacts = await Contact.find({ utilisateur: req.params.utilisateurId });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// API
route.post('/api/AddContact', controller.AddContact);
route.delete('/api/deleteC/:id', controller.deleteC);
route.patch('/api/update/:id', controller.update);
route.get('/api/findID/:id', controller.findID);
route.get('/api/find', controller.findAll);


module.exports = route