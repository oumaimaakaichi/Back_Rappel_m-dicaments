const express = require('express');
const router = express.Router();
const multer = require('multer');
const Document = require('../Models/Documents');
const DocController=require('../Controllers/Document')
router.get("/medicaments/:id", async (req, res) => {
    try {
     
      const { id } = req.params;
  
      
      const doc = await Document.findById(id);
  
     
      if (!doc) {
        return res.status(404).json({ message: "doc introuvable" });
      }
  
   
      res.status(200).json(doc);
    } catch (error) {
      console.error("Erreur lors de la recherche du doc par ID :", error);
      res.status(500).json({ error: "Erreur lors de la recherche du doc par ID" });
    }
  });

router.delete('/deleteDoc/:id' , DocController.deleteC)

router.get('/api/findAllDoc', DocController.findAllDoc);






var storage = multer.diskStorage({
    destination: function(req , file , cb){
        cb(null , './uploads/')
    },
     filename:function(req,file,cb){
        cb(null,Date.now()+ '-' + file.originalname) ;
    }
})




const upload = multer({
    storage: storage
});


/*router.post('/add-documentt', upload.single("image"), async (req, res) => {
    try {
        const { nom_document } = req.body;
        
        let imagePath = '';
        if (req.file) {
         
            imagePath = "http://192.168.43.105:5000/uploads/" + req.file.filename;
        }

       
        const newDocument = new Document({
            nom_document,
            image: imagePath
        });

    
        await newDocument.save();

        // Répondre avec un message de succès
        res.status(201).json({ message: 'Document ajouté avec succès' });
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de l\'ajout du document :', error);
        res.status(500).json({ error: 'Échec de l\'ajout du document' });
    }
});*/
router.post('/add-document', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'document', maxCount: 1 }]), async (req, res) => {
    try {
        const { nom_document } = req.body;
        
        let imagePath = '';
        let documentPath = '';

        if (req.files['image'] && req.files['image'][0]) {
            imagePath = "http://192.168.43.105:5000/uploads/" + req.files['image'][0].filename;
        }

        if (req.files['document'] && req.files['document'][0]) {
            documentPath = "http://192.168.43.105:5000/uploads/" + req.files['document'][0].filename;
        }

        const newDocument = new Document({
            nom_document,
            image: imagePath,
            document: documentPath
        });

        await newDocument.save();

        res.status(201).json({ message: 'Document ajouté avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du document :', error);
        res.status(500).json({ error: 'Échec de l\'ajout du document' });
    }
});






module.exports = router;
