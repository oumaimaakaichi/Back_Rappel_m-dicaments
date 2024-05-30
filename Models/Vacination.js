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

const rendezVous = mongoose.model("Vacination", schema);

module.exports = rendezVous;
