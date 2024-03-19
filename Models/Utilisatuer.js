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
  image: {
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
});

const Utilisateur = mongoose.model("Utilisateur", schema);

module.exports = Utilisateur;
