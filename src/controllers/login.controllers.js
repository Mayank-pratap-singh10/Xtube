import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";


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
const loginUser =asyncHandler(async(req,res)=>{
    const {userName,email,password}=req.body
    if(!(userName || email)){
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
     
    const loggedInUser=await User.findById(user._id).select("-password -refreshtokens")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User successfullly loggedIn"
        )
    )
    



})

const logoutUser =asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
           new: true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new apiResponse(200,{},"User logged Out!!"))
})


export {loginUser,logoutUser}