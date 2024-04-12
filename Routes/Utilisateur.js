const express = require("express");
const userController = require("../Controllers/Utilisateur");
const userRoutes = express.Router();
const utilisateur=require('../Models/Utilisatuer')
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const storage= require('../midleware/upload')
// Configuration du stockage pour multer


// Initialisation de multer avec le stockage configuré
const upload = multer({ storage: storage });

// Route pour ajouter un utilisateur avec la gestion du téléchargement de l'image
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
        nouveauUtilisateur.avatar ==  "http://192.168.43.105:5000/uploads/" + req.file.filename; // Vérifie si une image a été téléchargée
    }
    // Créez un nouvel utilisateur en utilisant les données envoyées dans req.body et l'image téléchargée
   
    // Enregistrez le nouvel utilisateur dans la base de données
    await nouveauUtilisateur.save();

    // Réponse réussie
    res.status(201).json({
      message: "Utilisateur ajouté avec succès !",
      type: "success",
    });
  } catch (err) {
    console.error(err);
    // En cas d'erreur, renvoyez une réponse d'erreur
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      type: "danger",
    });
  }
});

// Route pour télécharger uniquement l'avatar de l'utilisateur
userRoutes.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  // Renvoie l'URL de l'image téléchargée
  res.send("http://192.168.43.105:5000/uploads/" + req.file.filename);
});

// Autres routes pour obtenir, modifier, supprimer des utilisateurs, etc.
userRoutes.get("/:id", userController.getbyid);
userRoutes.post("/login", userController.login);
userRoutes.put("/modifier/:id", userController.modifier);

module.exports = userRoutes;
