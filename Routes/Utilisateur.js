const express = require("express");
const userController = require("../Controllers/Utilisateur");
const userRoutes = express.Router();
const utilisateur = require("../Models/Utilisatuer"); 
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const storage = require("../midleware/upload");



const upload = multer({ storage: storage });


userRoutes.post("/add-user", upload.single("avatar"), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const {
        nom,
        prenom,
        email,
        password,
        Num_tel,
        age,
        nbr_enfants,
        avatar
    }= req.body;
    const nouveauUtilisateur = new utilisateur({
        nom,
        prenom,
        email,
        password:hashedPassword,
        Num_tel,
        age,
        nbr_enfants,
avatar
      });
  
    if(req.file) {
        nouveauUtilisateur.avatar ==  "http://192.168.43.105:5000/uploads/" + req.file.filename; 

    }


    await nouveauUtilisateur.save();

    
    res.status(201).json({
      message: "Utilisateur ajouté avec succès !",
      type: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      type: "danger",
    });
  }
});


userRoutes.post("/upload-image", upload.single("avatar"), (req, res) => {

  res.send("http://192.168.43.105:5000/uploads/" + req.file.filename);
});


userRoutes.post("/upload-doc", upload.single("image"), (req, res) => {
 
  res.send("http://192.168.43.105:5000/uploads/" + req.file.filename);
});


userRoutes.get("/:id", userController.getbyid);
userRoutes.post("/login", userController.login);
userRoutes.put("/modifier/:id", userController.modifier);
userRoutes.post("/emailyni", userController.emailyni);

module.exports = userRoutes;
