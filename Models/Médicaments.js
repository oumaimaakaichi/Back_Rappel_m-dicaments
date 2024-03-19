const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  nom_medicament: {
    type: String,
    required: true,
  },

 

  Matin: {
    matin: Boolean,
    DatePrise:Date
  
  },
  nuit: {
    nuit: Boolean,
    DatePrise:Date
  
  },
 
  demi_journe: {
    demi_journe: Boolean,
    DatePrise:Date
  
  },


});

const Medicament = mongoose.model("Medicament", schema);

module.exports = Medicament;
