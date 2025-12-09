import {asyncHandler} from   "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
  
const registerUser = asyncHandler(async(req,res)=>{
    const {userName,email,fullname}=req.body
    console.log("email:",email)
    
})
export {registerUser}