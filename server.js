const express=require('express');
const mongoConnection=require('./database');
const RouteContact=require('./Routes/Contact')
const Document=require('./Models/Documents')
const DocumentRoute=require('./Routes/documents')
const Contact=require('./Models/Contacts-Médecins')
mongoConnection();
const app =express();
app.use(express.json())
app.use('/', RouteContact)
app.use('/', DocumentRoute)


app.get("/searchDoc/:key", async (req, resp) => {
    let data = await Document.find({
        "$or": [
            { nom_document: { $regex: req.params.key } },
            
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
});










