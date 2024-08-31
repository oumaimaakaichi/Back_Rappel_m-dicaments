const express = require("express");
const bodyParser = require("body-parser");
//const rendezVous = require("../Models/Rendez-vous");

const rendezVousModel = require("../Models/Rendez-vous");

const schedule = require("node-schedule");
const notifier = require("node-notifier");
const app = express();
const cron = require("node-cron");







const ajoute = async (req, res) => {
  const { date, heure, nom_docteur, lieu, objet, status, utilisateur } = req.body;
  const appointment = new rendezVousModel({
    date,
    heure,
    nom_docteur,
    lieu,
    objet,
    status: status || "en attente", 
    utilisateur,
  });

  try {
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.log(err); 
    res.status(500).json({
      error: "Erreur lors de l'ajout du rendez-vous dans la base de données.",
    });
  }
};

const getRendezVous = async (req, res) => {
  try {
    await rendezVousModel.find({}).then((result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
};

const supprimerRendezVous = async (req, res) => {
  try {
    await rendezVousModel.findOneAndDelete({ _id: req.params.id });
    res.send("supprimé avec sucess !");
  } catch (err) {
    res.send(err);
  }
};

const modifRendezVous = async (req, res) => {
  const { id } = req.params;
  const { date, heure, status, objet, nom_docteur } = req.body;

  try {
 
    let rendezVousToUpdate = await rendezVousModel.findById(id);

    if (!rendezVousToUpdate) {
      return res.status(404).json({ error: "Rendez-vous non trouvé." });
    }

  
    const originalDate = rendezVousToUpdate.date;
    const originalHeure = rendezVousToUpdate.heure;


    rendezVousToUpdate.nom_docteur = nom_docteur;
    rendezVousToUpdate.date = date;
    rendezVousToUpdate.heure = heure;
    rendezVousToUpdate.status = status || "en attente"; 
    rendezVousToUpdate.objet = objet;
  
    if (status !== "vister") {
      const title = `Rappel de rendez-vous avec le Dr. ${rendezVousToUpdate.nom_docteur}`;
      const message = `Vous avez un rendez-vous avec le Dr. ${rendezVousToUpdate.nom_docteur} à ${heure} le ${date}.`;


      const originalNotificationTime = new Date(
        `${originalDate} ${originalHeure}`
      );
      const dayBeforeNotification = new Date(
        originalNotificationTime.getTime() - 24 * 60 * 60 * 1000
      );
      const twoHoursBeforeNotification = new Date(
        originalNotificationTime.getTime() - 2 * 60 * 60 * 1000
      );
      schedule.cancelJob(dayBeforeNotification);
      schedule.cancelJob(twoHoursBeforeNotification);

   
      scheduleNotification(`${date} ${heure}`, title, message);
    }

 
    await rendezVousToUpdate.save();
    res.status(200).json(rendezVousToUpdate);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la modification du rendez-vous." });
  }
};


const getbyidrendezVous = async (req, res) => {
  try {
  
    const rendezVous = await rendezVousModel
      .findById(req.params.id)
      .populate("utilisateur");

   
    if (!rendezVous) {
      return res.status(404).send("Rendez-vous non trouvé.");
    }

  
    res.json(rendezVous);
  } catch (err) {

    console.error(err);
    res.status(500).send("Erreur serveur lors de la recherche du rendez-vous.");
  }
};

const getbyutlisateurrendezVous = async (req, res) => {
  try {
  
    const utilisateurId = req.params.utilisateur; 
    const rendezVous = await rendezVousModel.find({
      utilisateur: utilisateurId,
    });

    res.json(rendezVous); 
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des rendez-vous de l'utilisateur:",
      error
    );
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des rendez-vous de l'utilisateur.",
    });
  }
};

const getbyutlisateurrendezVousNotife1 = async (req, res) => {
  const userId = req.params.utilisateur;
  const currentDate = new Date();
  console.log(currentDate);
  try {
    const rendezVousList = await rendezVousModel.find({
      utilisateur: userId,
      date: {
        $lte: currentDate.toISOString(),
      },
    });

    const filteredRendezVousList = rendezVousList.filter((rendezVous) => {
      const rendezVousDateTime = new Date(rendezVous.date);
      const rendezVousHour = parseInt(rendezVous.heure.split(":")[0]);
      const rendezVousMinute = parseInt(rendezVous.heure.split(":")[1]);

    
      if (rendezVousDateTime.getTime() < currentDate.getTime()) {
        return true; 
      } else if (rendezVousDateTime.getTime() === currentDate.getTime()) {
   
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
       
        return (
          rendezVousHour > currentHour ||
          (rendezVousHour === currentHour && rendezVousMinute > currentMinute)
        );
      } else {
        return false; 
      }
    });

    res.json(filteredRendezVousList);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des rendez-vous." });
  }
};

const getRendezHier = async (req, res) => {
  try {
    const utilisateurId = req.params.utilisateurId;
    const currentDate = new Date(); 
    const tomorrow = new Date(currentDate); 
    tomorrow.setDate(currentDate.getDate() + 1); 

    console.log("currentDate:", currentDate);
    console.log("tomorrow:", tomorrow);

   
    const rendezVousDemain = await rendezVousModel.find({
      utilisateur: utilisateurId,
      date: { $gte: tomorrow.toISOString().slice(0, 10) }, 
    });

    console.log("rendezVousDemain:", rendezVousDemain);

    console.log(currentDate.toISOString().slice(11, 16));
    
    const rendezVousAujourdhui = await rendezVousModel.find({
      utilisateur: utilisateurId,
      date: currentDate.toISOString().slice(0, 10), 

      heure: {
        $gte: currentDate.toISOString().slice(11, 16),
       
      },
    });

    console.log("rendezVousAujourdhui:", rendezVousAujourdhui);

    const rendezVous = rendezVousDemain.concat(rendezVousAujourdhui);

    res.json(rendezVous);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
};

/*
const getRendezHier = async (req, res) => {
  try {
    const utilisateurId = req.params.utilisateurId; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête
    const currentDate = new Date(); // Date actuelle
    const tomorrow = new Date(currentDate); // Créer une copie de la date actuelle
    tomorrow.setDate(currentDate.getDate() + 1); // Ajouter un jour

    // Récupérer les rendez-vous de l'utilisateur pour demain
    const rendezVousDemain = await rendezVousModel.find({
      utilisateur: utilisateurId,
      date: { $gte: tomorrow.toISOString().slice(0, 10) }, // Date de demain
    });

    // Récupérer les rendez-vous de l'utilisateur pour aujourd'hui et dont l'heure n'est pas dépassée
    const rendezVousAujourdhui = await rendezVousModel.find({
      utilisateur: utilisateurId,
      date: currentDate.toISOString().slice(0, 10), // Date d'aujourd'hui
      $or: [
        { heure: { $gte: currentDate.toISOString().slice(11, 16) } }, // Heure postérieure ou égale à l'heure actuelle
        { heure: null }, // Si l'heure n'est pas définie (null), nous incluons également le rendez-vous
      ],
    });

    const rendezVous = rendezVousDemain.concat(rendezVousAujourdhui);

    res.json(rendezVous);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
};
*/

module.exports = {
  ajoute: ajoute,
  getRendezVous: getRendezVous,
  supprimerRendezVous: supprimerRendezVous,
  modifRendezVous: modifRendezVous,
  getbyidrendezVous: getbyidrendezVous,
  getbyutlisateurrendezVous: getbyutlisateurrendezVous,
  getbyutlisateurrendezVousNotife1: getbyutlisateurrendezVousNotife1,
  getRendezHier,
};