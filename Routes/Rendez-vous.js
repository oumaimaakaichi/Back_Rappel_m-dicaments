const express = require("express");
const rendezVousController = require("../Controllers/Rendez-vous");
const rendezVousRoutes = express.Router();

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
module.exports = rendezVousRoutes;
