import express from 'express'
import { verifyJWT } from '../MiddleWare/Auth.middleWare.js'
import { AddCrop, DeleteCrop, UpdateCrop } from '../Controllers/Crop.controller.js'

const router=express.Router()

router.use(verifyJWT)

router.route("/crops").post(AddCrop)
router.route("/crops/:id").put(UpdateCrop)
router.route("/crops/:id").delete(DeleteCrop)

router.route("/crops").get(AddCrop)

export default router;