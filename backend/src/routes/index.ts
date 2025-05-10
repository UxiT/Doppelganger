import express from "express"
import { transfer } from "../controller/transferController";

const router = express.Router()

router.post('/v1/transfer', transfer)

export default router
