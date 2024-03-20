const express=require('express');
const mongoConnection=require('./database');
const RouteContact=require('./Routes/Contact')



mongoConnection();
const app =express();
app.use(express.json())
app.use('/', RouteContact)





  
app.listen(5000 , 'localhost',()=>{
    console.log('Application connected sur le port 5000...');
});










