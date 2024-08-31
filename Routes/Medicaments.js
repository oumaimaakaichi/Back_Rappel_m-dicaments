const express = require('express');
const route = express.Router()

const Medicament=require('../Models/Médicaments')
const controllerM = require('../Controllers/Médicaments');
route.get("/medicaments/:id", async (req, res) => {
    try {
     
      const { id } = req.params;
  
   
      const medicament = await Medicament.findById(id);
  
   
      if (!medicament) {
        return res.status(404).json({ message: "Médicament introuvable" });
      }
  
     
      res.status(200).json(medicament);
    } catch (error) {
      console.error("Erreur lors de la recherche du médicament par ID :", error);
      res.status(500).json({ error: "Erreur lors de la recherche du médicament par ID" });
    }
  });
  route.put("/medicamentsUpdate/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Requête reçue pour l'ID :", id);
        console.log("Données reçues :", req.body);

        let medicament = await Medicament.findById(id);
        if (!medicament) {
            return res.status(404).json({ message: "Médicament introuvable" });
        }
        medicament = await Medicament.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(medicament);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du médicament par ID :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du médicament par ID" });
    }
});

  route.get('/medUtilisateur/:utilisateurId', async (req, res) => {
    try {
        const contacts = await Medicament.find({ utilisateur: req.params.utilisateurId });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
route.post('/api/AddMedicament', controllerM.AddMedicament);

route.delete('/deleteMed/:id' , controllerM.deleteMedicament)

route.get('/api/findAllMed', controllerM.findAllDoc);
route.put('/medicamentsPrendre/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    const medication = await Medicament.findById(id);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }
   
    medication.prendre = false;
  
    await medication.save();
  
    res.json({ message: "Medication prendre field updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

route.put('/updateMed/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

   
    const updatedMedicament = await Medicament.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedMedicament) {
      return res.status(404).json({ message: "Médicament non trouvé" });
    }

    res.status(200).json(updatedMedicament);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du médicament", error });
  }
});

module.exports = route