const express = require("express");
const bodyParser = require("body-parser");
//const rendezVous = require("../Models/Rendez-vous");

const rendezVousModel = require("../Models/Vacination");

const schedule = require("node-schedule");
const notifier = require("node-notifier");
const app = express();
const cron = require("node-cron");

function scheduleNotification(date, title, message) {
  const notificationTime = new Date(date);

  const dayBeforeNotification = new Date(
    notificationTime.getFullYear(),
    notificationTime.getMonth(),
    notificationTime.getDate() - 1, 
    21, // Heure
    43 // Minute
  );
  schedule.scheduleJob(dayBeforeNotification, () => {
    notifier.notify({ title, message });
  });

 
  const twoHoursBeforeNotification = new Date(
    notificationTime.getTime() - 2 * 60 * 60 * 1000
  );
  schedule.scheduleJob(twoHoursBeforeNotification, () => {
    notifier.notify({ title, message });
  });
}


function scheduleNotification(date, title, message) {
  const notificationTime = new Date(date);

  const dayBeforeNotification = new Date(
    notificationTime.getFullYear(),
    notificationTime.getMonth(),
    notificationTime.getDate() - 1, 
    0, // Heure
    25 // Minute
  );
  schedule.scheduleJob(dayBeforeNotification, () => {
    notifier.notify({ title, message });
  });


  const twoHoursBeforeNotification = new Date(
    notificationTime.getTime() - 2 * 60 * 60 * 1000
  );
  schedule.scheduleJob(twoHoursBeforeNotification, () => {
    notifier.notify({ title, message });
  });
}



const ajoute = async (req, res) => {
  const { date, heure, nom_docteur, lieu, objet, status, utilisateur } =
    req.body;
  const appointment = new rendezVousModel({
    date,
    heure,

    lieu,
    objet,
    status: status || "en attente", 
    utilisateur, 
  });

 

  try {
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json(console.log(err), {
      error: "Erreur lors de l'ajout du rendez-vous dans la base de données.",
    });
  }
};




const getvacination = async (req, res) => {
  try {
    await rendezVousModel.find({}).then((result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
};

const getbyidVacitantion = async (req, res) => {
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

const modifVacination = async (req, res) => {
  const { id } = req.params;
  const { date, heure, status, objet, lieu } = req.body;

  try {
 
    let rendezVousToUpdate = await rendezVousModel.findById(id);

    if (!rendezVousToUpdate) {
      return res.status(404).json({ error: "Rendez-vous non trouvé." });
    }

  
    const originalDate = rendezVousToUpdate.date;
    const originalHeure = rendezVousToUpdate.heure;

    

    rendezVousToUpdate.date = date;
    rendezVousToUpdate.heure = heure;
    rendezVousToUpdate.status = status || "en attente"; 
    rendezVousToUpdate.ob;
    jet = objet;
  
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
/*
const deletevacinaion = async (req, res) => {
  try {
    await rendezVousModel.findOneAndDelete({ _id: req.params.id });
    res.send("supprimé avec sucess !");
  } catch (err) {
    res.send(err);
  }
};*/

const deletevacinaion = async (req, res) => {
  try {
 
    await rendezVousModel.findOneAndDelete({ _id: req.params.id });

  
    const nouvellesVaccinations = await rendezVousModel.find();

   
    res.json(nouvellesVaccinations);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getvacinationbyid = async (req, res) => {
  try {
    
    const utilisateurId = req.params.ut; 

 
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

const modifVacin = async (req, res) => {
  const { id } = req.params;
  const { date, heure, status, objet, lieu } = req.body;

  try {
 
    let rendezVousToUpdate = await rendezVousModel.findById(id);

    if (!rendezVousToUpdate) {
      return res.status(404).json({ error: "vacinnon trouvé." });
    }

  
    const originalDate = rendezVousToUpdate.date;
    const originalHeure = rendezVousToUpdate.heure;

  

    rendezVousToUpdate.date = date;
    rendezVousToUpdate.heure = heure;
    rendezVousToUpdate.status = status || "en attente"; 
    rendezVousToUpdate.objet = objet;
    rendezVousToUpdate.lieu = lieu;
   
    if (status !== "vister") {
      const message = `Vous avez une vacin  à ${heure} le ${date}.`;

    
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

      
      scheduleNotification(`${date} ${heure}`, message);
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

module.exports = {
  ajoute: ajoute,
  getvacination: getvacination,
  getbyidVacitantion: getbyidVacitantion,
  modifVacination: modifVacination,
  deletevacinaion: deletevacinaion,
  getvacinationbyid: getvacinationbyid,
  modifVacin: modifVacin,
};
