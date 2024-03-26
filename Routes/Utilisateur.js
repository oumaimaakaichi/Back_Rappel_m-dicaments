const express = require("express");
const userController = require("../Controllers/Utilisateur");
const userRoutes = express.Router();

userRoutes.post("/", userController.ajoute);

userRoutes.get("/:id", userController.getbyid);

userRoutes.post("/login", userController.login);

userRoutes.put("/modifier/:id", userController.modifier);
module.exports = userRoutes;
