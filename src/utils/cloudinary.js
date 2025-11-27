import {v2 as cloudinary} from  "cloudinary"
import fs from "fs"
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
    
})


const uploadOnCloudinary=async (localPath)=>{
    try{
        if(!localPath) return null//checking the file
        const response=await cloudinary.uploader.upload(localPath,{
            resource_type:"auto"//uploading the file
        })
        //sending a response
        console.log("the file has been uploaded",response.url)
    }
    catch(error){
        //if file uploadation failed
        fs.unlinkSync(localPath) 
        return null;
    }
}

export {uploadOnCloudinary}