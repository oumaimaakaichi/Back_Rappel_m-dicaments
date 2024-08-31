const utilisateur = require("../Models/Utilisatuer");
const express = require("express");

const multer = require("multer");

const secretKey = "1234567";
const jwt = require("jsonwebtoken");
const app = express();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

app.use("/uploads", express.static("uploads"));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");


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
        image: req.file
          ? `http://localhost:5000/uploads/${req.file.filename}`
          : "", 
      });

      await nouveauUtilisateur.save();
    
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
          Data: user,
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
      
      const utilisateurExistant = await utilisateur.findById(req.params.id);
      if (!utilisateurExistant) {
        return res.status(404).json({
          message: "Utilisateur non trouvé",
          type: "danger",
        });
      }

      
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

    
      if (req.file) {
        utilisateurExistant.image = `/uploads/${req.file.filename}`;
      }

     
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


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
  },
});


const updateUserPassword = async (email, newPassword) => {
  try {
  
    const user = await utilisateur.findOne({ email });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

 
    user.password = newPassword;

   
    await user.save();
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du mot de passe de l'utilisateur :",
      error.message
    );
    throw error;
  }
};
const bcrypt = require("bcrypt");

const emailyni = (req, res) => {
  const { email } = req.body;


  const newPassword = generateRandomPassword();


  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Erreur lors du cryptage du mot de passe :", err);
      return res.status(500).json({
        message: "Erreur lors de la réinitialisation du mot de passe.",
      });
    }

   
    updateUserPassword(email, hashedPassword);

   
    transporter.sendMail(
      {
        from: "oumaimaakaichi00@gmail.com",
        to: email,
        subject: "Réinitialisation de mot de passe",
        text: `Votre mot de passe a été réinitialisé avec succès. Voici votre nouveau mot de passe : ${newPassword}. Pour des raisons de sécurité, veuillez le changer dès que possible.`,
      },
      (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).json({
            message: "Une erreur est survenue lors de l'envoi de l'e-mail.",
          });
        } else {
          console.log("E-mail envoyé: " + info.response);
          res.status(200).json({
            message:
              "Un e-mail de réinitialisation de mot de passe a été envoyé. Veuillez vérifier votre boîte de réception pour obtenir votre nouveau mot de passe.",
          });
        }
      }
    );
  });
};


const generateRandomPassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 
  let newPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    newPassword += charset[randomIndex];
  }
  return newPassword;
};

module.exports = {
  ajoute: ajoute,
  getbyid: getbyid,
  login: login,
  modifier: modifier,
  emailyni: emailyni,
};
