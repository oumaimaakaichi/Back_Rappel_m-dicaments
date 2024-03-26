const express = require("express");
const mongoConnection = require("./database");
const userRoutes = require("./Routes/Utilisateur");
const rendezVousRoutes = require("./Routes/Rendez-vous");

mongoConnection();
const app = express();
app.use(express.json());

app.listen(5000, "localhost", () => {
  console.log("Application connected sur le port 5000...");
});

app.use("/api/utlisateur", userRoutes);
app.use("/api/rendezVous", rendezVousRoutes);
