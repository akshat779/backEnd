import User from "../models/user.models.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import  {ApiError} from "../utils/ApiError.js";



const createUser = asyncHandler(async(req,res)=>{
    const {fullName,email,password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });
    return res.render("home")
})

const signInUser = asyncHandler(async(req,res)=>{
    const{email,password} = req.body;
    if(!email || !password){
        throw new ApiError(400,"Please Provide both fields");
    }
    const user = await User.findOne({email:email});
    if(!user){
        throw new ApiError(400,"User not found");
    }
   
    const tokenRecieved = await user.isPasswordCorrect(email,password);

    return res.cookie("token",tokenRecieved).redirect("home")




})
export{
    createUser,
    signInUser
}