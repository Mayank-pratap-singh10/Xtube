import {asyncHandler} from   "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.models.js" 
import {uploadOnCloudinary} from  "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js" 
const registerUser = asyncHandler(async(req,res)=>{
    const {userName,email,fullName,password}=req.body
    
    if(
        [userName,email,password,fullName].some((field)=>
        field?.trim()=== "")
    ){
        throw new apiError(400,"All fields are required")
    }
    
    const existingUSer= await User.findOne({
        $or: [{userName},{email}]
    })
    if(existingUSer){
        throw new apiError(409,"User already Exists")
    }

    const avatarLocalPath=req.files?.avatar?.[0]?.path || null;
    const coverImageLocalpath=req.files?.coverImage?.[0]?.path || null;

    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file is required")
    }

    const avatar=uploadOnCloudinary(avatarLocalPath)
    const coverImage=uploadOnCloudinary(coverImageLocalpath);
    if(!avatar){
        throw new apiError(400,"Avatar file is required")

    }
    const user=await User.create({
        fullName,
        avatar: avatar?.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        userName:userName.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshTokens"
     )
    if(!createdUser){
        throw new apiError(500,"Something went wrong")
     }
    return res.status(201).json(
        new apiResponse(200,createdUser,"User registered Successfully")
    )


     
    
})
export {registerUser}