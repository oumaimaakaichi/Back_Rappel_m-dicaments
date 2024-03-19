const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    nom_document : {
        type : String,
        required: true
    },

    image:{
        type : String,
       
    },
    document:{
        type: Buffer,
        
    }



    
   
   
})

const Document = mongoose.model('Document', schema);

module.exports = Document;