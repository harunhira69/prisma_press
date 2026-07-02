import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { AuthPayload } from "./auth.interface"
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";


const loginUsereIntoDB = async(payload:AuthPayload)=>{
const {email,password}= payload;

const user = await prisma.user.findUniqueOrThrow({
    where:{
        email
    }
})

const isPasswordMatched = await bcrypt.compare(password,user.password);

if(!isPasswordMatched){
    throw new Error("Password is incorrect")
}


const jwtPaylod = {
    id:user.id,
    name:user.name,
    email:user.email,
    role:user.role
}

// const accessToken = jwt.sign(jwtPaylod,config.jwt_access_secret,{
//     expiresIn:config.jwt_access_expiry
// } as SignOptions
// )

const accessToken = jwtUtils.createToken(
    jwtPaylod,
    config.jwt_access_secret,
    config.jwt_access_expiry as SignOptions
)


// const refreshToken = jwt.sign(jwtPaylod,config.jwt_refresh_secret,{
//     expiresIn:config.jwt_refresh_expiry
// } as SignOptions
// )

const refreshToken = jwtUtils.createToken(
    jwtPaylod,
    config.jwt_refresh_secret,
    config.jwt_refresh_expiry as SignOptions
)


return { user, accessToken,refreshToken };

}

const refreshToken = async(refreshToken:string)=>{

const verifyRefreshToken = jwtUtils.verifyToken(refreshToken,config.jwt_refresh_secret)

if(!verifyRefreshToken.success){
    throw new Error(verifyRefreshToken.message);
    
}

const {id} = verifyRefreshToken.data as JwtPayload;


const user = await prisma.user.findUniqueOrThrow({
    where:{
        id
    }

})

if(user.activeStatus==="BLOCKED"){
    throw new Error("User is Blocked");
    
}

const jwtPayload = {
    id,
    name:user.name,
    email:user.email,
    role:user.role,

}

const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expiry as SignOptions
);

return {accessToken}
}


export const loginService = {
    loginUsereIntoDB,
    refreshToken
}