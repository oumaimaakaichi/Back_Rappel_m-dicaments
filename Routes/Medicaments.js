const express = require('express');
const route = express.Router()

const Medicament=require('../Models/Médicaments')
const controllerM = require('../Controllers/Médicaments');
route.get("/medicaments/:id", async (req, res) => {
    try {
      // Récupérer l'ID du médicament depuis les paramètres de la requête
      const { id } = req.params;
  
      // Rechercher le médicament dans la base de données par son ID
      const medicament = await Medicament.findById(id);
  
      // Vérifier si le médicament existe
      if (!medicament) {
        return res.status(404).json({ message: "Médicament introuvable" });
      }
  
      // Retourner le médicament trouvé
      res.status(200).json(medicament);
    } catch (error) {
      console.error("Erreur lors de la recherche du médicament par ID :", error);
      res.status(500).json({ error: "Erreur lors de la recherche du médicament par ID" });
    }
  });
  route.put("/medicamentsUpdate/:id", async (req, res) => {
    try {
     
      const { id } = req.params;
  
     
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
  
route.post('/api/AddMedicament', controllerM.AddMedicament);

route.delete('/deleteMed/:id' , controllerM.deleteMedicament)

route.get('/api/findAllMed', controllerM.findAllDoc);

module.exports = route