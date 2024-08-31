
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
route.put('/updateContact/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

  
    const updatedMedicament = await Contact.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedMedicament) {
      return res.status(404).json({ message: "Médicament non trouvé" });
    }

    res.status(200).json(updatedMedicament);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du médicament", error });
  }
});

// API
route.post("/api/AddContact", controller.AddContact);
route.delete("/api/deleteC/:id", controller.deleteC);
route.patch("/api/update/:id", controller.update);
route.get("/api/findID/:id", controller.findID);
route.get("/api/find", controller.findAll);
route.get("/contactsUtilisateur/:utilisateurId", async (req, res) => {
  try {
    const contacts = await Contact.find({
      utilisateur: req.params.utilisateurId,
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = route;
