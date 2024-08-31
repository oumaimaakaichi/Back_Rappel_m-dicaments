const express = require("express");
const rendezVousController = require("../Controllers/Rendez-vous");
const rendezVousRoutes = express.Router();
const RendezVous=require('../Models/Rendez-vous')
rendezVousRoutes.post("/ajoutren", rendezVousController.ajoute);

rendezVousRoutes.get("/getRendez-vous", rendezVousController.getRendezVous);

rendezVousRoutes.delete(
  "/supprimerRendez-vous/:id",
  rendezVousController.supprimerRendezVous
);

rendezVousRoutes.put(
  "/modifRendez-vous/:id",
  rendezVousController.modifRendezVous
);

rendezVousRoutes.get(
  "/getbyid/ren/:id",
  rendezVousController.getbyidrendezVous
);

rendezVousRoutes.get(
  "/getbyutlisateur/ut/:utilisateur",
  rendezVousController.getbyutlisateurrendezVous
);

rendezVousRoutes.get(
  "/getbyutlisateur/ut/notife/:utilisateur",
  rendezVousController.getbyutlisateurrendezVousNotife1
);

rendezVousRoutes.get(
  "/getRendez-vous/hier/:utilisateurId",
  rendezVousController.getRendezHier
);



rendezVousRoutes.get("/rendezVous/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const rendezVous = await RendezVous.find({ utilisateur: userId }) 

    res.json(rendezVous);
  } catch (err) {
    console.error("Erreur lors de la récupération des rendez-vous :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
});




rendezVousRoutes.put('/modifR/:id', async (req, res) => {
  const rendezVousId = req.params.id;
  const updateFields = req.body;

  try {
    const updatedRendezVous = await RendezVous.findByIdAndUpdate(
      rendezVousId,
      updateFields,
      { new: true }
    );

    if (!updatedRendezVous) {
      return res.status(404).json({ error: 'Rendez-vous not found' });
    }

    res.status(200).json(updatedRendezVous);
  } catch (error) {
    console.error('Error updating rendez-vous:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = rendezVousRoutes;
