
var Contact = require('../Models/Contacts-Médecins')

exports.AddContact = (req,res)=>{
  
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

  
    const contact = new Contact({
        nom_docteur : req.body.nom_docteur,
        Prenom_docteur : req.body.Prenom_docteur,
        num_telephone:req.body.num_telephone,
        adresse_doc:req.body.adresse_doc,
        Specialite_docteur:req.body.Specialite_docteur,
        email:req.body.email
        
    })

    // save user in the database
    contact
        .save(contact)
        .then(data => {
            res.status(200).send({
                message : "jout avec succée"
            });
           
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}
exports.deleteC = (req, res)=>{
    const id = req.params.id;

    Contact.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "contact was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}
exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Contact.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update contact with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}


exports.findID = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Contact.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Contact.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

exports.findAll = (req, res)=>{

    if(req.query.id){
       

        Contact.find()
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id "})
            })

    }else{
        Contact.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

exports.search = async(req, res)=>{
    let data = await Contact.find({
        "$or" : [
            {titre : {$regex:req.params.key}},
           
           
        ]
    })
    resp.send(data);
}