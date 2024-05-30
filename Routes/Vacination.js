const express = require("express");
const VacinationController = require("../Controllers/Vacination");
const VacinationRoutes = express.Router();

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

module.exports = VacinationRoutes;
