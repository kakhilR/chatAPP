import dotEnv from 'dotenv';
import mongoose from 'mongoose';
dotEnv.config();

console.log(process.env.mongodb_uri,"uri")
export const databaseConnection =  async()=>{
    try{
        await mongoose.connect(process.env.mongodb_uri,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
        console.log('DB connected');
    }catch(error){
        console.log("========Error=====");
        console.log(error);
        process.exit(1);
    }
}