const mongoose=require('mongoose');


const mongoConnection=async()=>{
    try{
        const connect =await mongoose.connect('mongodb://127.0.0.1:27017/PFA',
        {
            useNewUrlParser:true,
            useUnifiedTopology:true
        },
      
        );
        console.log('Mongodb connected ');
        console.log(`Server is running on Port ${connect.connection.host}`);
    }catch(err){
        console.log(err);
    }
}
module.exports=mongoConnection;
