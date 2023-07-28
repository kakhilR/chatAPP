import { GenerateSecretToken } from "../middlewares/index.js";
import { UserModel } from "../models/User.js";

export const registerUser = async (req,res)=>{
    console.log(req.body)
    const { name, email, password} = req.body;
    try{
        const findUser = UserModel.findOne({ email: email});
        if(findUser==null){
            throw "user already exits"
        }
        const user = new UserModel({name,email,password})
        const _user = await user.save();
        console.log(_user,"user")
        if(_user !=null || _user!=undefined) {
            return res.status(200).send({message:'success'});
        }else{
            console.log(_user,"message")
            return res.status(404).send({message:'failed'});
        }
    }catch(e){
        return res.send(e);
    }
    
}

export const loginUser = async (req,res)=>{
    // console.log(req.body)
    const {email,password} = req.body;
    try{
        const existingUser = await UserModel.findOne({email: email});
        if(existingUser===null){
            throw 'user does not exist'
        }
        console.log(existingUser.id,"user")
        if(existingUser.password===password){
            
            const token = await GenerateSecretToken({id:existingUser.id});
            return res.status(200).send({data:{id:existingUser.id,token},message:'success'})
        }else{
            return res.status(401).send({message:"please check you password"})
        }

    }catch(e){
        return res.send(e);
    }
}