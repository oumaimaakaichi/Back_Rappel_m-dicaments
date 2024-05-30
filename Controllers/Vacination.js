const express = require("express");
const bodyParser = require("body-parser");
//const rendezVous = require("../Models/Rendez-vous");

const rendezVousModel = require("../Models/Vacination");

const schedule = require("node-schedule");
const notifier = require("node-notifier");
const app = express();
const cron = require("node-cron");
const NotificationService = require("./notificationService");
// Fonction pour planifier une notification
function scheduleNotification(date, title, message) {
  const notificationTime = new Date(date);

  const dayBeforeNotification = new Date(
    notificationTime.getFullYear(),
    notificationTime.getMonth(),
    notificationTime.getDate() - 1, // Un jour avant
    21, // Heure
    43 // Minute
  );
  schedule.scheduleJob(dayBeforeNotification, () => {
    notifier.notify({ title, message });
  });

  // Planifier la notification deux heures avant le rendez-vous
  const twoHoursBeforeNotification = new Date(
    notificationTime.getTime() - 2 * 60 * 60 * 1000
  );
  schedule.scheduleJob(twoHoursBeforeNotification, () => {
    notifier.notify({ title, message });
  });
}

// Ajouter un rendez-vous
function scheduleNotification(date, title, message) {
  const notificationTime = new Date(date);

  const dayBeforeNotification = new Date(
    notificationTime.getFullYear(),
    notificationTime.getMonth(),
    notificationTime.getDate() - 1, // Un jour avant
    0, // Heure
    25 // Minute
  );
  schedule.scheduleJob(dayBeforeNotification, () => {
    notifier.notify({ title, message });
  });

  // Planifier la notification deux heures avant le rendez-vous
  const twoHoursBeforeNotification = new Date(
    notificationTime.getTime() - 2 * 60 * 60 * 1000
  );
  schedule.scheduleJob(twoHoursBeforeNotification, () => {
    notifier.notify({ title, message });
  });
}

// Ajouter un rendez-vous

const ajoute = async (req, res) => {
  const { date, heure, nom_docteur, lieu, objet, status, utilisateur } =
    req.body;
  const appointment = new rendezVousModel({
    date,
    heure,

    lieu,
    objet,
    status: status || "en attente", // Statut par défaut : en attente
    utilisateur, // Utilisateur associé au rendez-vous
  });

  // Planifier les notifications si le statut n'est pas "partire"
  if (status !== "partire") {
    const title = `Rappel de rendez-vous avec le Dr. ${nom_docteur}`;
    const message = `Vous avez un rendez-vous avec le Dr. ${nom_docteur} à ${heure} le ${date}.`;
    scheduleNotification(`${date} ${heure}`, title, message);
  }

  try {
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json(console.log(err), {
      error: "Erreur lors de l'ajout du rendez-vous dans la base de données.",
    });
  }
};

cron.schedule("0 9 * * *", async () => {
  try {
    const rendezVousList = await rendezVousModel.find({
      date: { $gte: new Date(new Date().setDate(new Date().getDate() + 1)) },
    });
    rendezVousList.forEach(async (rdv) => {
      await NotificationService.scheduleNotification(rdv._id, rdv.date);
    });
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
});

cron.schedule("0 7 * * *", async () => {
  try {
    const currentDate = new Date();
    const rendezVousList = await rendezVousModel.find({
      date: {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        ),
        $lte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          23,
          0,
          0
        ),
      },
    });
    rendezVousList.forEach(async (rdv) => {
      await NotificationService.sendNotification(
        rdv._id,
        "Reminder: Your appointment is in 2 hours"
      );
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
});
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
    // Utilisez la méthode findById pour trouver le rendez-vous par son ID
    const rendezVous = await rendezVousModel
      .findById(req.params.id)
      .populate("utilisateur");

    // Vérifiez si le rendez-vous existe
    if (!rendezVous) {
      return res.status(404).send("Rendez-vous non trouvé.");
    }

    // Envoyez les données du rendez-vous, y compris les données de l'utilisateur associé
    res.json(rendezVous);
  } catch (err) {
    // Gérez les erreurs
    console.error(err);
    res.status(500).send("Erreur serveur lors de la recherche du rendez-vous.");
  }
};

const modifVacination = async (req, res) => {
  const { id } = req.params;
  const { date, heure, status, objet, lieu } = req.body;

  try {
    // Trouver le rendez-vous à modifier
    let rendezVousToUpdate = await rendezVousModel.findById(id);

    if (!rendezVousToUpdate) {
      return res.status(404).json({ error: "Rendez-vous non trouvé." });
    }

    // Sauvegarder l'heure et la date d'origine pour la notification
    const originalDate = rendezVousToUpdate.date;
    const originalHeure = rendezVousToUpdate.heure;

    // Mettre à jour les champs du rendez-vous

    rendezVousToUpdate.date = date;
    rendezVousToUpdate.heure = heure;
    rendezVousToUpdate.status = status || "en attente"; // Statut par défaut : en attente
    rendezVousToUpdate.ob;
    jet = objet;
    // Planifier les notifications si le statut n'est pas "partire"
    if (status !== "vister") {
      const title = `Rappel de rendez-vous avec le Dr. ${rendezVousToUpdate.nom_docteur}`;
      const message = `Vous avez un rendez-vous avec le Dr. ${rendezVousToUpdate.nom_docteur} à ${heure} le ${date}.`;

      // Supprimer les anciennes notifications
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

      // Planifier les nouvelles notifications
      scheduleNotification(`${date} ${heure}`, title, message);
    }

    // Enregistrer les modifications
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
    // Supprimer la vaccination
    await rendezVousModel.findOneAndDelete({ _id: req.params.id });

    // Récupérer la nouvelle liste des vaccinations
    const nouvellesVaccinations = await rendezVousModel.find();

    // Retourner la nouvelle liste des vaccinations
    res.json(nouvellesVaccinations);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getvacinationbyid = async (req, res) => {
  try {
    // Récupérer l'identifiant de l'utilisateur à partir des paramètres de la requête
    const utilisateurId = req.params.ut; // Supposons que l'identifiant de l'utilisateur est passé dans les paramètres de la requête

    // Requête pour récupérer tous les rendez-vous de l'utilisateur spécifié
    const rendezVous = await rendezVousModel.find({
      utilisateur: utilisateurId,
    });

    res.json(rendezVous); // Renvoyer les rendez-vous récupérés en tant que réponse JSON
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
    // Trouver le rendez-vous à modifier
    let rendezVousToUpdate = await rendezVousModel.findById(id);

    if (!rendezVousToUpdate) {
      return res.status(404).json({ error: "vacinnon trouvé." });
    }

    // Sauvegarder l'heure et la date d'origine pour la notification
    const originalDate = rendezVousToUpdate.date;
    const originalHeure = rendezVousToUpdate.heure;

    // Mettre à jour les champs du rendez-vous

    rendezVousToUpdate.date = date;
    rendezVousToUpdate.heure = heure;
    rendezVousToUpdate.status = status || "en attente"; // Statut par défaut : en attente
    rendezVousToUpdate.objet = objet;
    rendezVousToUpdate.lieu = lieu;
    // Planifier les notifications si le statut n'est pas "partire"
    if (status !== "vister") {
      const message = `Vous avez une vacin  à ${heure} le ${date}.`;

      // Supprimer les anciennes notifications
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

      // Planifier les nouvelles notifications
      scheduleNotification(`${date} ${heure}`, message);
    }

    // Enregistrer les modifications
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
