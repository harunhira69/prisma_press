import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import config from "../../config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken"
import { jwtUtils } from "../../utils/jwt";


const registerUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

const payload = req.body;

const user = await userService.registerUserIntoDB(payload);


// res.status(httpStatus.CREATED).json({ 
//         success:true,
//         statusCode:httpStatus.CREATED,
//         message: "User registered successfully" ,
//         data:{
//             user
//         }
// });


sendResponse(res,{
    success:true,
    statusCode:httpStatus.CREATED,
    message: "User registered successfully" ,
    data:{
        user
    }
})



})

const userProfile = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{


const profile = await userService.userProfileIntoDB(req.user?.id as string) 

sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"User profile fetched successfully",
    data:{profile}

})

})

const updateProfile = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const userId = req.user?.id as string;
const payload = req.body;

const updatedProfiles = await userService.updateProfileIntoDB(userId,payload);

sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"User profile Updated successfully",
    data:{updatedProfiles}

})

})

export const userController = {
    registerUser,
    userProfile,
    updateProfile,
    
}