import { User } from "../Models/User.model.js"
import { AsyncHandler } from "../Utils/AsyncHandler.js"
import {ApiError} from "../Utils/ApiError.js"
import {ApiResponse} from "../Utils/ApiResponse.js"
import mongoose from "mongoose"
import { uploadonCloudinary } from "../Utils/Cloudinary.js"




const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        
        if (!user) throw new ApiError(404, "User not found");

        const accessToken = user.generateAccessToken();
       
        const refreshToken = user.generateRefreshToken();
        

        user.RefreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    }   catch (error) {
        throw new ApiError(500, error.message || "Token generation failed");
    }
};


const register= AsyncHandler(async(req,res,next)=>{
    const {Name,PhoneNo,EmailId,Password,Role,Address,adminSecret}=req.body

    if(!Name || !PhoneNo || !EmailId || !Password || !Address){
        throw new ApiError(400,"Field is mandatory !!");
    }
    if (Role === "admin") {
        if(!adminSecret){
            throw new ApiError(400,"Field is mandatory");
        }
    // Check if the provided secret matches your .env ADMIN_SECRET_KEY
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      //  SEND THE SPECIFIC ERROR MESSAGE HERE
      throw new ApiError(
        403, 
        "You are not a verified user to become admin. Please contact on kishansetu.care@gmail.com"
      );
    }
  }
    const existedUser=await User.findOne(
        {
        $or:[{PhoneNo:PhoneNo.trim()},
            {EmailId:EmailId.toLowerCase().trim()}
        ]
        }
    )
    if(existedUser) throw new ApiError(409,"User already Exists");
   

    let avatarUrl="";
    const AvatarLocalPath = req.files?.avatar?.[0]?.path;
    if(AvatarLocalPath) {
        const avatarUpload=await uploadonCloudinary(AvatarLocalPath);
        avatarUrl=avatarUpload?.url || ""
    }
    console.log("aaa",avatarUrl)

    const createUser=await User.create(
        {
            Name:Name.toLowerCase().trim(),
            PhoneNo:PhoneNo.trim(),
            EmailId:EmailId.toLowerCase().trim(),
            Avatar:avatarUrl,
            Role:Role || "farmer",
            Address,
            Password,
        }
    );
    const createdUser=await User.findById(createUser._id).select(" -Password -RefreshToken");
    if(!createdUser) throw new ApiError(500,"somthing went wrong,user register failed")
        

   return res.status(201).json(
  new ApiResponse(201, createdUser, "User registered successfully")
    );
    
})


//login
// verify with id,phoneno & password
//

const login= AsyncHandler(async(req,res,next)=>{
    const {identifier,Password}=req.body;
    
    
    if(!identifier) throw new ApiError(401,"EmailId or PhoneNo is required");
    if(!Password) throw new ApiError(401,"Password is required")
    // const user=await User.findOne(
    //     {
    //     $or:[{EmailId},{PhoneNo}]
    //     }
    // );
    
    let query;

    if (identifier.includes("@")) {
        query = { EmailId: identifier.toLowerCase() };
    } 
    else {
        if (isNaN(identifier)) {
            throw new ApiError(400, "Invalid phone number");
        }
        query = { PhoneNo: Number(identifier) };
    }

    const user = await User.findOne(query);
    console.log(user)

    if (!user) throw new ApiError(404, "User not found");


    const verifyPassword= await user.isPasswordCorrect(Password)
    console.log("PASSWORD VERIFIED");

    if(!verifyPassword) throw new ApiError(401,"Invalid credentials")

    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id);
    console.log("TOKEN GENERATED");
    const loggedInUser=await User.findById(user._id).select(" -Password -RefreshToken")
    //sending into coolkies
    const isProduction = process.env.NODE_ENV === "production";

    const options={
        httpOnly:true,
        secure:isProduction,
         sameSite: isProduction ? "none":"lax"
    }
    
    return res
    .status(200)
   // .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)

    .json(
        new ApiResponse(
            200,
            {user:loggedInUser,accessToken},
            "User logged In Successfully"
        )
    )

})

const logout= AsyncHandler(async(req,res,next)=>{
    //remove cookie,refresh,accesstoken
   await  User.findByIdAndUpdate(
        req.user._id,
        {
           $set: { RefreshToken: undefined }

        },
        {
            new:true
        }
    )
    const isProduction = process.env.NODE_ENV === "production"; 

     const options={
        httpOnly:true,
        secure:isProduction,
        sameSite: isProduction ? "none":"lax"
    }
    return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"user logout successfully"));
})



export {register,login,logout }