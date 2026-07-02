import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postServices } from "./posts.service";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from "http-status";



const createPosts = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   const id = req.user?.id;
   const payload = req.body;

   const result = await postServices.createPostsIntoDB(payload,id as string);
   

   sendResponse(res,{
      success:true,
      statusCode:httpStatus.CREATED,
      message:"Post Created Successfully",
      data:result
   })
})

const getAllPosts = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   const query = req.query;
//   console.log(query.searchTerm);

const result = await postServices.getPostsIntoDB(query);

sendResponse(res,{
   success:true,
   statusCode:httpStatus.OK,
   message:"Post Retrieve successfully",
   data:result
})

})


const getPostsByStats = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

const result = await postServices.getPostsStatsIntoDB();

sendResponse(res,{
   success:true,
   statusCode:httpStatus.OK,
   message:"Post stats Retrieve successfully",
   data:result
})

})


const getMyPosts = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

const authorid = req.user?.id;

const result = await postServices.getMyPostsIntoDB(authorid as string);

sendResponse(res,{
   success:true,
   statusCode:httpStatus.OK,
   message:"My Posts Retrieve Successfully",
   data:result
})

})


const getPostsById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

const postId = req.params.postId;

if(!postId){
   throw new Error("Post Id Required");
   
}

const result = await postServices.getPostsByIdIntoDB(postId as string);
sendResponse(res,{
   success:true,
   statusCode:httpStatus.OK,
   message:"Post Retrieve Successfuly",
   data:result
})


})




const updatePosts = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   const authorid = req.user?.id;
   const isAdmin = req.user?.role === "ADMIN";
   const postId = req.params.postId;

   const payload = req.body;

   const result = await postServices.updatePostsIntoDB(postId as string,payload,authorid as string,isAdmin)

sendResponse(res,{
   success:true,
   statusCode:httpStatus.OK,
   message:"Post updated Successfully",
   data:result
})

})

const deletePostsById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

   const authorid = req.user?.id;
   const isAdmin = req.user?.role === "ADMIN";
   const postId = req.params.postId;




if(!postId){
   throw new Error("Post Id Required");
   
}

 await postServices.deletePostsByIdIntoDB(postId as string,authorid as string,isAdmin)

sendResponse(res,{
   success:true,
   statusCode:httpStatus.OK,
   message:"Post deleted Successfully",
   data:null
})


})





export const postController = {
   getAllPosts,
   getPostsByStats,
   getMyPosts,
   getPostsById,
   createPosts,
   updatePosts,
   deletePostsById



}