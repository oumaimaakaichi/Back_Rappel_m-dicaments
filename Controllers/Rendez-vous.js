const express = require("express");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const notifier = require("node-notifier");
const rendezVous = require("../Models/Rendez-vous");
const app = express();
app.use(bodyParser.json());

// Fonction pour planifier une notification
function scheduleNotification(date, title, message) {
  const notificationTime = new Date(date);

  // Planifier la notification un jour avant le rendez-vous
  const dayBeforeNotification = new Date(
    notificationTime.getTime() - 24 * 60 * 60 * 1000
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
  const { date, heure, nom_docteur, lieu, objet, status } = req.body;
  const appointment = new rendezVous({
    date,
    heure,
    nom_docteur,
    lieu,
    objet,
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
};

const getRendezVous = async (req, res) => {
  try {
    await rendezVous.find({}).then((result) => {
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
};

const supprimerRendezVous = async (req, res) => {
  try {
    await rendezVous.findOneAndDelete({ _id: req.params.id });
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
    let rendezVousToUpdate = await rendezVous.findById(id);

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

module.exports = {
  ajoute: ajoute,
  getRendezVous: getRendezVous,
  supprimerRendezVous: supprimerRendezVous,
  modifRendezVous: modifRendezVous,
};
