const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },

  password: {
    type: String,
  },
  Num_tel: {
    type: Number,
    maxLength: 8,
  },
  age: {
    type: Number,
  },
  nbr_enfants: {
    type: Number,
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
  },
});

const Utilisateur = mongoose.model("Utilisateur", schema);

module.exports = Utilisateur;
