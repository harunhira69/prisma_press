import { Router } from "express";
import { postController } from "./posts.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const router = Router()

router.get("/",postController.getAllPosts)

router.get("/stats",auth(Role.ADMIN),postController.getPostsByStats)

router.get("/my-posts",auth(Role.USER,Role.ADMIN),postController.getMyPosts)

router.get("/:postId",postController.getPostsById)

router.post("/",auth(Role.USER,Role.ADMIN),postController.createPosts)

router.patch("/:postId",auth(Role.USER,Role.ADMIN),postController.updatePosts)

router.delete(
  "/:postId",
  auth(Role.USER, Role.ADMIN),
  postController.deletePostsById
);

export const  postRouter = router;