import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "./../models/user.models.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "./../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAcessandRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return{accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"Error in generating Tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // user validation
    // check if user already exists : email or username
    // if files present 
    // upload them to cloudinary, avatar 
    // create user object - create call in db
    // remove password and refresh token from response
    // check for user creation
    // return res

    const { fullname, email, username, password } = req.body
    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please fill all fields")
    }

    const existingUser = await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(existingUser){
        throw new ApiError(409, "User already exists")
    }



    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"please add an avatar")
    }
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath)
    const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatarUrl){
        throw new ApiError(400,"Avatar is required")
    }
    
    const user = await User.create({
        fullname,
        email,
        username:username.toLowerCase(),
        avatar: avatarUrl.url,
        coverImage: coverImageUrl?.url || "",
        password,
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"User not created")
    }
    return res.status(201).json(new ApiResponse(201, createdUser, "User created Successfully"))

})


const loginUser = asyncHandler(async (req,res)=> {
    // get info from req.body
    // username or email
    // check if user exists
    // check password
    // generate token
    // send secure cookies
    // return res

    const {email,username,password} = req.body;
    console.log(email)
    if(!email && !username){
        throw new ApiError(400,"Please provide an email or username")
    }

    const existingUser = await User.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(!existingUser){
        throw new ApiError(404,"User not found");
    }
    
    const passwordCheck = await existingUser.isPasswordCorrect(password);
    if(!passwordCheck){
        throw new ApiError(401,"Invalid credentials");
    }
    const {accessToken,refreshToken} = await generateAcessandRefreshToken(existingUser._id);

    const loggedInUser = User.findById(existingUser._id).select("-password -refreshToken")
    
    const options = {
        httpOnly:true,
        secure:true,
    }
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{user:loggedInUser.toJSON,accessToken,refreshToken},"User logged in successfully"))
})

const logoutUser = asyncHandler(async(req,res) => {
    User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken:undefined,
            }
            
        },
        {
            new:true
        }
    )
    const options ={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const {incomingRefreshToken} = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(401,"Please provide a refresh token")
    }
    try {
        const decodedToken = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh Token")
        }
    
        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        const options= {
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newrefreshToken} = await generateAcessandRefreshToken(user._id);
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,
                refreshToken : newrefreshToken},
                "Access Token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid")
    }

})

const changeCurrentPassword = asyncHandler(async (req,res)=> {
    const{oldPassword,newPassword} = req.body;
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid Old Password")
    }
    user.password = newPassword;
    await user.save({
        validateBeforeSave:false
    })

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password Changed Successfully"))

})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(200, req.user,"current user fetched Successfully")
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname,email,username} = req.body
    if(!fullname || !email){
        throw new ApiError(400,"Please provide with a fullname or email atleast")
    }
    const user = await User.findByIdandUpdate(req.user?._id,
        {
            $set:{
                fullname,
                email
            }
        },
        {new:true}
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account details updated successfully"))

})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    // console.log(req.files?.avatar[0].path)
    const avatarLocalPath =req.files?.avatar[0].path
    if(!avatarLocalPath){
        throw new ApiError(400,"Please provide an avatar")
    }
    // console.log(req.user._conditions._id)
    const oldImageToBeDeleted = await User.findById(req.user?._conditions?._id);
    // console.log(oldImageToBeDeleted.avatar)
    if(!oldImageToBeDeleted){
        throw new ApiError(400,"No avatar to delete")
    }
    
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    if(!avatarUrl.url){
        throw new ApiError(400,"Error while uploading avatar")
    }
    const user = await User.findByIdAndUpdate(req.user?._conditions?._id,
        {
            $set:{
                avatar:avatarUrl.url
            }
        },
        {
            new:true
        }
    )
    
    await deleteFromCloudinary(oldImageToBeDeleted.avatar);
    return res.status(200)
    .json(new ApiResponse(200,user,"Avatar Updated Successfully"))
    

 })

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const localCoverImage = req.file?.path
    
    const oldImageToBeDeleted = await User.findById(req.user?._id).select("coverImage");
    if(!oldImageToBeDeleted){
        throw new ApiError(400,"No avatar to delete")
    }
    if(!localCoverImage){
        throw new ApiError(400,"Please provide a cover Image");
    }
    const coverImageUrl = await uploadOnCloudinary(localCoverImage)
    if(!coverImageUrl.url){
        throw new ApiError(400,"Error while uploading cover Image")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                coverImage:coverImageUrl.url
            }
        },
        {new:true}
    )
    await deleteFromCloudinary(oldImageToBeDeleted);
    return res.status(200)
    .json(new ApiResponse(200,user,"Cover Image Updated Successfully"))
})

const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const {username} = req.params;
    if(!username?.trim()){
        throw new ApiError(400,"Username does not exist")
    }

    const channel = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscriberCount:{$size:"$subscribers"},
                subscribedToCount:{$size:"$subscribedTo"},
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id, "$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }

                }
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                avatar:1,
                coverImage:1,
                email:1,
                subscriberCount:1,
                subscribedToCount:1,
                isSubscribed:1
            }
        }
    ])
    if(!channel?.length){
        throw new ApiError(404,"Channel not found")
    }
    return res.status(200)
    .json(new ApiResponse(200,channel[0],"Channel fetched successfully"))
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile
}

