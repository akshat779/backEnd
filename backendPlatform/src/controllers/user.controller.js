import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "./../models/user.models.js"
import { uploadOnCloudinary } from "./../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

    const { fullName, email, username, password } = req.body
    console.log(fullName, email, username, password);
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Please fill all fields")
    }

    const existingUser = User.findOne({
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
        fullName,
        email,
        username:username.toLowerCase(),
        avatar: avatarUrl.url,
        coverImage: coverImageUrl?.url || "",
        password,
    })
    const createdUser = User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"User not created")
    }
    return res.status(201).json(new ApiResponse(201, createdUser, "User created Successfully"))

})

export { registerUser }