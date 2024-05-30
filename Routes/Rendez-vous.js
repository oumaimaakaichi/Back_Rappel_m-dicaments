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

module.exports = rendezVousRoutes;
