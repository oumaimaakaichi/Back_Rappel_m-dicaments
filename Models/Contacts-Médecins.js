const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  nom_docteur: {
    type: String,
    required: true,
  },

  Prenom_docteur: {
    type: String,
    required: true,
  },
  num_telephone: {
    type: String,
  },
  email: {
    type: String,
  },

  adresse_doc: {
    type: String,
  },
  Specialite_docteur: {
    type: String,
    required: true,
  },

  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
  },
});

const Contact = mongoose.model("Contact", schema);

module.exports = Contact;
