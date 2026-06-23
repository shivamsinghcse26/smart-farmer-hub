import express, { Router } from 'express'
import { login, register,logout } from '../Controllers/User.controller.js';
import { verifyJWT } from '../MiddleWare/Auth.middleWare.js';
import { upload } from '../MiddleWare/Multer.middleWare.js';
import 'multer'
const router=Router();

router.post(
    "/register",
    upload.fields([
        { name: "avatar", maxCount: 1 }
    ]),
    register
);
router.route("/login").post(login)

router.route("/logout").post(verifyJWT,logout)



export default router;