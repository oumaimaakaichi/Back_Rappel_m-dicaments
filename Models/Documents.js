const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  nom_document: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },
  document: {
    type: String,
  },

  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
  },
});

const Document = mongoose.model("Document", schema);

module.exports = Document;
