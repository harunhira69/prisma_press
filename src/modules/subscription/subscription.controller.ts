import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'

const createCheckOut = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const userId = req.user?.id

    const result = await subscriptionService.createCheckOut(userId as string)

    sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"payment checkout successfuly",
    data:result
    })
})


const handleStripeWebhook = catchAsync(async (req, res) => {

  const signature = req.headers["stripe-signature"] as string;

  await subscriptionService.handleStripeWebhook(
    req.body,
    signature
  );

  res.status(200).send({
    received: true,
  });
});

export const subscriptionController = {
    createCheckOut,handleStripeWebhook
}