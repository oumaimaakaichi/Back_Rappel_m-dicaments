

const Document = require('../Models/Documents')

exports.deleteC = (req, res)=>{
    const id = req.params.id;

    Document.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Document was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}


exports.findDocByID = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Document.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found doc with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Document.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}


exports.findAllDoc = (req, res)=>{

    if(req.query.id){
       

        Document.find()
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found doc with id "})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id "})
            })

    }else{
        Document.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}
