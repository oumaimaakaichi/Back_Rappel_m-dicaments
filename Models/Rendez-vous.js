const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },

  heure: {
    type: Date,
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
});

const rendezVous = mongoose.model("rendez-vous", schema);

module.exports = rendezVous;
