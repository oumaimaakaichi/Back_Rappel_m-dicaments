<<<<<<< HEAD
const express = require("express");
const mongoConnection = require("./database");
const userRoutes = require("./Routes/Utilisateur");
const rendezVousRoutes = require("./Routes/Rendez-vous");

mongoConnection();
const app = express();
app.use(express.json());

app.listen(5000, "localhost", () => {
  console.log("Application connected sur le port 5000...");
=======
const express=require('express');
const mongoConnection=require('./database');
const RouteContact=require('./Routes/Contact')
const Document=require('./Models/Documents')
const DocumentRoute=require('./Routes/documents')
const Contact=require('./Models/Contacts-Médecins')
const RouteMedicament=require('./Routes/Medicaments')
const Medicament=require('./Models/Médicaments')
mongoConnection();
const app =express();
app.use(express.json())
app.use('/', RouteContact)
app.use('/', DocumentRoute)
app.use('/', RouteMedicament)

app.get("/searchDoc/:key", async (req, resp) => {
    let data = await Document.find({
        "$or": [
            { nom_document: { $regex: req.params.key } },
            
        ]
    })
    resp.send(data);
})
app.get("/searchMedicament/:key", async (req, resp) => {
    let data = await Medicament.find({
        "$or": [
            { nom_medicament: { $regex: req.params.key } },
            
        ]
    })
    resp.send(data);
})
app.get("/searchcontact/:key", async (req, resp) => {
    let data = await Contact.find({
        "$or" : [
            {nom_docteur : {$regex:req.params.key}},
            {Prenom_docteur : {$regex:req.params.key}},
           
        ]
    })
    resp.send(data);
})



app.listen(5000 , 'localhost',()=>{
    console.log('Application connected sur le port 5000...');
>>>>>>> 8ec949e4adb6148faaf9ea45545e189c5df1db2f
});

app.use("/api/utlisateur", userRoutes);
app.use("/api/rendezVous", rendezVousRoutes);
