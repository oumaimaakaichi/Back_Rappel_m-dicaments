const express=require('express');
const mongoConnection=require('./database');




mongoConnection();
const app =express();
app.use(express.json())






  
app.listen(5000 , 'localhost',()=>{
    console.log('Application connected sur le port 5000...');
});










