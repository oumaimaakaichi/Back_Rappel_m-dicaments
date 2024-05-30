const express = require("express");
const router = express.Router();
const multer = require("multer");
const Document = require("../Models/Documents");
const DocController = require("../Controllers/Document");

// Configuration du stockage pour Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dossier de destination pour les fichiers téléchargés
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    // Nom du fichier enregistré avec un horodatage pour éviter les doublons
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Configuration de Multer avec le stockage défini
const upload = multer({ storage: storage });

// Route pour ajouter un document avec téléchargement de fichiers
router.post(
  "/add-document",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { nom_document, utilisateur } = req.body;

      let imagePath = "";
      let documentPath = "";

      // Vérifier si une image a été téléchargée
      if (req.files["image"] && req.files["image"][0]) {
        imagePath =
          "http:// 192.168.43.116:5000/uploads/" +
          req.files["image"][0].filename;
      }

      // Vérifier si un document a été téléchargé
      if (req.files["document"] && req.files["document"][0]) {
        documentPath =
          "http:// 192.168.43.116:5000/uploads/" +
          req.files["document"][0].filename;
      }

      // Créer une nouvelle instance de Document avec les chemins des fichiers téléchargés
      const newDocument = new Document({
        nom_document,
        image: imagePath,
        document: documentPath,
        utilisateur,
      });

      // Enregistrer le document dans la base de données
      await newDocument.save();

      res.status(201).json({ message: "Document ajouté avec succès" });
    } catch (error) {
      console.error("Erreur lors de l'ajout du document :", error);
      res.status(500).json({ error: "Échec de l'ajout du document" });
    }
  }
);
router.get("/docUser/:utilisateurId", async (req, res) => {
  try {
    const contacts = await Document.find({
      utilisateur: req.params.utilisateurId,
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/deleteDoc/:id", DocController.deleteC);

module.exports = router;
