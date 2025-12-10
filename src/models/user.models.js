import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebToken from "jsonwebtoken";

const userSchema= new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,


    },
    watchHistory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"videos"
    }],
    password:{
        type:String,
        required:[true, "password is required"]
            
    },
    refreshTokens:{
        type:String

    }
},{timestamps:true})

userSchema.pre("save",function(next){
    if(this.isModified("password")){
    this.password=bcrypt.hash(this.password,10)
    next()
}

})
userSchema.methods.isPasswordCorrect =async function(password){
    return await bcrypt.compare(password ,this.password)

}
userSchema.methods.generateAccessToken=function(){
     return jwt.sign({
        _id:this._id,
        fullName:this.fullName,
        userName:this.userName,
        email:this.email,


    },
     process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRES

    })

}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
        
    },
      process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EPIRES
    })
    
}
export const User=mongoose.model("User",userSchema)