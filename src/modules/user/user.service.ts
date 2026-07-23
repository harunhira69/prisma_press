import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";


const registerUserIntoDB = async (payload:RegisterUserPayload)=>{

      const {name,email,password,profilePhoto} = payload;
const isUserExist = await prisma.user.findUnique({
    where: {
        email
    }
});

if (isUserExist) {
    throw new Error("User already exists");
}


    
    const hashedPassword = await bcrypt.hash(password,Number(config.bycrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }
    })
await prisma.profile.create({
        data:{
            userId: createdUser.id,
            profilePhoto

        }
    })

const user = await prisma.user.findUnique({
    where: {
        id: createdUser.id
    },
    omit: {
        password: true
    },
    include: {
        profile: true
    }
});
    return user;

}

const userProfileIntoDB = async(userId:string)=>{
  
    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id:userId
        },
        omit:{
            password:true
        },
        include:{
            profile:true
        }
    });
    return user

}

const updateProfileIntoDB = async(
    userId:string
    ,payload:any
)=>{
    const {name,email,bio,profilephoto}= payload;

    const updatedUser = await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            name,
            email,
            profile:{
                update:{
                    profilephoto,
                    bio
                }
            }
        },
        omit:{
            password:true
        },
        include:{
            profile:true
        }
    })
    return updatedUser

}

export const userService = {
    registerUserIntoDB,
    userProfileIntoDB,
    updateProfileIntoDB

}