import Router from "express"
import { registerUser } from "../controllers/register.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { loginUser ,logoutUser} from "../controllers/login.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router= Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
    ])
,registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT , logoutUser)
export default router