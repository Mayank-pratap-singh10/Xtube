import Router from "express"
import { registerUser } from "../controllers/register.controllers";
const router= Router()
router.route("/register").post(registerUser)
export default router