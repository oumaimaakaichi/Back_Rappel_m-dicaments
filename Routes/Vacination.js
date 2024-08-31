const express = require("express");
const VacinationController = require("../Controllers/Vacination");
const VacinationRoutes = express.Router();
const vaccination=require('../Models/Vacination')
VacinationRoutes.post("/ajoutVacination", VacinationController.ajoute);
VacinationRoutes.get("/getVacination", VacinationController.getvacination);
VacinationRoutes.get(
  "/getbyvactionation/vac/:id",
  VacinationController.getbyidVacitantion
);

// il put ma t5demch
VacinationRoutes.put(
  "/modifRendezvous/:id",
  VacinationController.modifVacination
);
VacinationRoutes.delete(
  "/deletevacination/vac/:id",
  VacinationController.deletevacinaion
);

VacinationRoutes.get(
  "/getvacinationbyid/idut/:ut",
  VacinationController.getvacinationbyid
);
VacinationRoutes.put("/modifier/idut/:id", VacinationController.modifVacin);


VacinationRoutes.get("/vaccinationGet/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const rendezVous = await vaccination.find({ utilisateur: userId }) 

    res.json(rendezVous);
  } catch (err) {
    console.error("Erreur lors de la récupération des rendez-vous :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
});


module.exports = VacinationRoutes;
