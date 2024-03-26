const utilisateur = require("../Models/Utilisatuer");
const express = require("express");

const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use("/uploads", express.static("uploads"));

//app.use("/uploads", express.static("uploads"));

// Configuration de multer pour le stockage des fichiers téléchargés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

// Fonction pour ajouter un utilisateur
const ajoute = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors du téléchargement de l'image",
        type: "danger",
      });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const nouveauUtilisateur = new utilisateur({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: hashedPassword,
        Num_tel: req.body.Num_tel,
        age: req.body.age,
        nbr_enfants: req.body.nbr_enfants,
        image: req.file ? `/uploads/${req.file.filename}` : "", // Vérifiez si un fichier a été téléchargé avant d'accéder à ses propriétés
      });

      await nouveauUtilisateur.save();
      /*req.session.message = {
        type: "success",
        message: "Utilisateur ajouté avec succès !",
      };*/
      res.json({
        message: "Utilisateur ajouté avec succès !",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        type: "danger",
      });
    }
  });
};

const getbyid = async (req, res) => {
  try {
    await utilisateur.findOne({ _id: req.params.id }).then((utl) => {
      if (!utl) {
        res.status(404).json({
          message: "objet non trouvé",
        });
        return;
      }
      res.status(200).json({
        model: utl,
        message: "Objet trouvé",
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const login = (req, res, next) => {
  utilisateur.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res
        .status(401)
        .json({ message: "login ou mot de passe incorrecte" });
    }
    bcrypt
      .compare(req.body.password, user.password)
      .then((valid) => {
        if (!valid) {
          return res
            .status(401)
            .json({ message: "login ou mot de passe incorrecte" });
        }
        res.status(200).json({
          token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          }),
        });
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  });
};

const modifier = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors du téléchargement de l'image",
        type: "danger",
      });
    }

    try {
      // Vérifiez si un utilisateur avec l'ID spécifié existe dans la base de données
      const utilisateurExistant = await utilisateur.findById(req.params.id);
      if (!utilisateurExistant) {
        return res.status(404).json({
          message: "Utilisateur non trouvé",
          type: "danger",
        });
      }

      // Mettez à jour les champs facultatifs s'ils sont fournis dans la requête
      if (req.body.nom) {
        utilisateurExistant.nom = req.body.nom;
      }
      if (req.body.prenom) {
        utilisateurExistant.prenom = req.body.prenom;
      }
      if (req.body.email) {
        utilisateurExistant.email = req.body.email;
      }
      if (req.body.Num_tel) {
        utilisateurExistant.Num_tel = req.body.Num_tel;
      }
      if (req.body.age) {
        utilisateurExistant.age = req.body.age;
      }
      if (req.body.nbr_enfants) {
        utilisateurExistant.nbr_enfants = req.body.nbr_enfants;
      }

      // Si une nouvelle image est téléchargée, mettez à jour le chemin de l'image
      if (req.file) {
        utilisateurExistant.image = `/uploads/${req.file.filename}`;
      }

      // Enregistrez les modifications dans la base de données
      await utilisateurExistant.save();

      res.json({
        message: "Utilisateur modifié avec succès !",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Erreur lors de la modification de l'utilisateur",
        type: "danger",
      });
    }
  });
};

module.exports = {
  ajoute: ajoute,
  getbyid: getbyid,
  login: login,
  modifier: modifier,
};
