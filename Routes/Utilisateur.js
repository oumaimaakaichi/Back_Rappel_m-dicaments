const express = require("express");
const userController = require("../Controllers/Utilisateur");
const userRoutes = express.Router();
const Utilisateur = require("../Models/Utilisatuer"); // Correction du chemin d'importation
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const storage = require("../midleware/upload");

// Configuration du stockage pour multer
// Initialisation de multer avec le stockage configuré
const upload = multer({ storage: storage });

// Route pour ajouter un utilisateur avec la gestion du téléchargement de l'image
userRoutes.post("/add-user", upload.single("avatar"), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { nom, prenom, email, password, Num_tel, age, nbr_enfants, avatar } =
      req.body;
    const nouveauUtilisateur = new Utilisateur({
      // Utilisation du modèle Utilisateur
      nom,
      prenom,
      email,
      password: hashedPassword,
      Num_tel,
      age,
      nbr_enfants,
      avatar,
    });

    if (req.file) {
      nouveauUtilisateur.avatar =
        "http:// 192.168.43.116:5000/uploads/" + req.file.filename; // Correction de l'assignation
    }

    // Enregistrez le nouvel utilisateur dans la base de données
    await nouveauUtilisateur.save();

    // Réponse réussie
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

// Route pour télécharger une image
userRoutes.post("/upload-image", upload.single("avatar"), (req, res) => {
  // Renvoie l'URL de l'image téléchargée
  res.send("http:// 192.168.43.116:5000/uploads/" + req.file.filename);
});

// Route pour télécharger un document
userRoutes.post("/upload-doc", upload.single("image"), (req, res) => {
  // Renvoie l'URL du document téléchargé
  res.send("http:/ 192.168.43.116:5000/uploads/" + req.file.filename);
});

// Autres routes pour obtenir, modifier, supprimer des utilisateurs, etc.
userRoutes.get("/:id", userController.getbyid);
userRoutes.post("/login", userController.login);
userRoutes.put("/modifier/:id", userController.modifier);
userRoutes.post("/emailyni", userController.emailyni);

module.exports = userRoutes;
