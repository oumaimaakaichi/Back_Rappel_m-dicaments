const express = require("express");
const router = express.Router();
const Medicament = require("../Models/Médicaments");


exports.AddMedicament = async(req,res)=>{
  try {
   
    const { nom_medicament, matin, nuit, demi_journe } = req.body;

    
    const nouveauMedicament = new Medicament({
      nom_medicament,
      Matin: {
        matin: matin.matin,
        DatePrise: matin.DatePrise
      },
      nuit: {
        nuit: nuit.nuit,
        DatePrise: nuit.DatePrise
      },
      demi_journe: {
        demi_journe: demi_journe.demi_journe,
        DatePrise: demi_journe.DatePrise
      }
    });

    
    await nouveauMedicament.save();

    res.status(201).json({ message: "Médicament ajouté avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout du médicament :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du médicament" });
  }
};

exports.deleteMedicament = (req, res)=>{
    const id = req.params.id;

    Medicament.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Medicament was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Medicament with id=" + id
            });
        });
}



exports.findAllDoc = (req, res)=>{

    if(req.query.id){
       

        Medicament.find()
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found Medicament with id "})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id "})
            })

    }else{
        Medicament.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

