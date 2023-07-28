import dotEnv from 'dotenv';
import jwt from 'jsonwebtoken';


dotEnv.config();
export const GenerateSecretToken = async (payload) => {
    try {
      return await jwt.sign({id:payload.id}, process.env.secret_key, { expiresIn: "3d" });
    } catch (error) {
      console.log(error);
      return error;
    }
};

const ValidateSecretToken = async (req)=>{
    try{
        const token = req.get("Authorization");
        // console.log(token);
        const payload = await jwt.verify(token.split(" ")[1], process.env.secret_key);
        req.user = payload;
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const userAuth = async (req, res, next) => {
    const isAuthorized = await ValidateSecretToken(req);
    if(isAuthorized) {
        return next();
    }

    return res.status(403).json({message:'not Authorized'});
}
