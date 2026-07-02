import { Router } from "express";
import { commentsController } from "./comments.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/author/:authorId", commentsController.getCommentsByAuthorId);

router.get("/:commentId", commentsController.getCommentById);

router.post("/:commentId", auth(Role.USER, Role.ADMIN), commentsController.createComment);

router.patch("/:commentId", auth(Role.USER, Role.ADMIN), commentsController.updateComment);

router.delete("/:commentId", auth(Role.ADMIN, Role.USER), commentsController.deleteComment);

router.put("/:commentId/moderate", auth(Role.ADMIN), commentsController.moderateComment);


export const commentsRoute = router;