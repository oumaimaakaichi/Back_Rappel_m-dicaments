const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  nom_medicament: {
    type: String,
    required: true,
  },

  Matin: {
    matin: Boolean,
    DatePrise: String,
  },
  nuit: {
    nuit: Boolean,
    DatePrise: String,
  },

  demi_journe: {
    demi_journe: Boolean,
    DatePrise: String,
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
  },
  prendre: {
    type: Boolean,
    default: true,
  },
});

const Medicament = mongoose.model("Medicament", schema);

module.exports = Medicament;
