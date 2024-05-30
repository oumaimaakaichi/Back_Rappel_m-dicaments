const express = require("express");
const bodyParser = require("body-parser");
//const rendezVous = require("../Models/Rendez-vous");

const rendezVousModel = require("../Models/Rendez-vous");

const schedule = require("node-schedule");
const notifier = require("node-notifier");
const app = express();
const cron = require("node-cron");
const NotificationService = require("./notificationService");

app.use(bodyParser.json());

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
    nom_docteur,
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

const getbyutlisateurrendezVousNotife = async (req, res) => {};
/*const ajoute = async (req, res) => {
  const { date, heure, nom_docteur, lieu, objet, status, utilisateur } =
    req.body;
  const appointment = new rendezVousModel({
    date,
    heure,
    nom_docteur,
    lieu,
    objet,
    utilisateur,
    status: status || "en attente", // Statut par défaut : en attente
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
};*/
/*
const ajoute = async (req, res) => {
  try {
    const rendezVous = new rendezVousModel(req.body);
    await rendezVous.save();
    res.status(201).json({ message: "Rendez-vous ajouté avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/
// Schedule notifications
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
    // Trouver le rendez-vous à modifier
    let rendezVousToUpdate = await rendezVousModel.findById(id);

    if (!rendezVousToUpdate) {
      return res.status(404).json({ error: "Rendez-vous non trouvé." });
    }

    // Sauvegarder l'heure et la date d'origine pour la notification
    const originalDate = rendezVousToUpdate.date;
    const originalHeure = rendezVousToUpdate.heure;

    // Mettre à jour les champs du rendez-vous
    rendezVousToUpdate.nom_docteur = nom_docteur;
    rendezVousToUpdate.date = date;
    rendezVousToUpdate.heure = heure;
    rendezVousToUpdate.status = status || "en attente"; // Statut par défaut : en attente
    rendezVousToUpdate.objet = objet;
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

// Modifier le statut d'un rendez-vous
/*app.put("/appointments/:id", async (req, res) => {
  const appointmentId = req.params.id;
  const newStatus = req.body.status;

  try {
    const appointment = await rendezVous.findByIdAndUpdate(
      appointmentId,
      { status: newStatus },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: "Rendez-vous non trouvé." });
    }

    // Si le nouveau statut est "partire", annuler la notification
    if (newStatus === "partire") {
      // Logique pour annuler la notification
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la modification du statut du rendez-vous.",
    });
  }
});*/

const getbyidrendezVous = async (req, res) => {
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

const getbyutlisateurrendezVous = async (req, res) => {
  try {
    // Récupérer l'identifiant de l'utilisateur à partir des paramètres de la requête
    const utilisateurId = req.params.utilisateur; // Supposons que l'identifiant de l'utilisateur est passé dans les paramètres de la requête

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

      // Comparaison de la date et de l'heure
      if (rendezVousDateTime.getTime() < currentDate.getTime()) {
        return true; // Si la date du rendez-vous est antérieure à la date actuelle, récupérer le rendez-vous
      } else if (rendezVousDateTime.getTime() === currentDate.getTime()) {
        // Si la date du rendez-vous est la même que la date actuelle, vérifier l'heure
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        // Vérifier si l'heure du rendez-vous est passée par rapport à l'heure actuelle
        return (
          rendezVousHour > currentHour ||
          (rendezVousHour === currentHour && rendezVousMinute > currentMinute)
        );
      } else {
        return false; // Si la date du rendez-vous est ultérieure à la date actuelle, ne pas récupérer le rendez-vous
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
    const utilisateurId = req.params.utilisateurId; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête
    const currentDate = new Date(); // Date actuelle
    const tomorrow = new Date(currentDate); // Créer une copie de la date actuelle
    tomorrow.setDate(currentDate.getDate() + 1); // Ajouter un jour

    console.log("currentDate:", currentDate);
    console.log("tomorrow:", tomorrow);

    // Récupérer les rendez-vous de l'utilisateur pour demain
    const rendezVousDemain = await rendezVousModel.find({
      utilisateur: utilisateurId,
      date: { $gte: tomorrow.toISOString().slice(0, 10) }, // Date de demain
    });

    console.log("rendezVousDemain:", rendezVousDemain);

    console.log(currentDate.toISOString().slice(11, 16));
    // Récupérer les rendez-vous de l'utilisateur pour aujourd'hui
    const rendezVousAujourdhui = await rendezVousModel.find({
      utilisateur: utilisateurId,
      date: currentDate.toISOString().slice(0, 10), // Date d'aujourd'hui

      heure: {
        $gte: currentDate.toISOString().slice(11, 16),
        // Heure postérieure ou égale à l'heure actuelle
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