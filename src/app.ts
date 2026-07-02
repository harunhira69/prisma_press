import express, { Application, Request, Response, urlencoded } from "express"
import cookieParser from  "cookie-parser"
import cors from "cors"
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRouter } from "./modules/user/user.route";
import { loginRouter } from "./modules/auth/auth.route";
import { postRouter } from "./modules/posts/posts.route";
import { commentsRoute } from "./modules/comments/comments.route";
import { notFound } from "./middleware/notFounde";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
const app: Application = express();



app.use(cors({
    origin:config.app_url,
    credentials:true,
}));

app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",(req:Request,res:Response)=>{
    res.send("Hello WOrld")
})


app.use("/api/users",userRouter)
app.use("/api/auth",loginRouter)
app.use("/api/posts",postRouter)
app.use("/api/comments",commentsRoute)

app.use(notFound)
app.use(globalErrorHandler)

export default app

