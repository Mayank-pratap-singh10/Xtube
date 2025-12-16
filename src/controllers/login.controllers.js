import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";


const genrateAccessAndRefreshTokenGenerator=async(userid)=>{
    try {
        const user =User.findById(userid)
        const refreshToken=user.generateRefreshToken()
        const accessToken=user.generateAccesstoken()
        user.refreshToken=refreshToken()
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new apiError(500,"something went wrong ")
        
    }
}
const loginUser =asyncHandler(async()=>{
    const {userName,email,password}=req.body
    if(!userName || !email){
        throw new apiError(400,"Username or email is required")
    }
    const user=await User.findOne({
        $or : [{userName},{email}]
    })
    if(!user){
        throw new apiError(404,"User doesnot exists")

    }
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apiError(404,"Password is incorrect")
    }
    const {accessToken,refreshToken}=await genrateAccessAndRefreshTokenGenerator(user._id)
     
    const loggedInUser=await User.findOne(user._id)

    



})


export {loginUser}