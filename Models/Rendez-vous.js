const mongoose = require("mongoose");

var schema = new mongoose.Schema({
 date: {
    type: Date,
    required: true,
  },

 heure:{
    type: Date,
    required: true,

 },

  nom_docteur:{
    type: Date,
  

  },
  lieu: {
    nuit: String,
  
  
  },
 
  objet: {
    demi_journe: String,
  
  
  },


});

const rendezVous = mongoose.model("rendez-vous", schema);

module.exports = rendezVous;
