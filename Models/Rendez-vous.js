const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },

  heure: {
    type: String,
    required: true,
  },

  nom_docteur: {
    type: String,
  },
  lieu: {
    type: String,
  },

  objet: {
    type: String,
  },
  status: {
    type: String,
    enum: ["en attente", "vister"],
    default: "en attente",
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
  },
});

const rendezVous = mongoose.model("rendez-vous", schema);

module.exports = rendezVous;
