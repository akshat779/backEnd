import {User} from '../models/users.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { URL } from '../models/url.models.js';
import {v4 as uuidv4} from 'uuid'
import {setUser,getUser} from "./../utils/auth.js"


const createUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        throw new ApiError(400,"Please provide all the required fields")
    }
    const user = await User.create({
        name,
        email,
        password
    })
    const allurls = await URL.find({createdBy:req.user?._id})
    return res.render("home",{allurls:allurls});
})

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new ApiError(400,"Please provide all the required fields")
    }
    const user = await User.findOne({
        email:email,
        password:password
    })
    if(!user){
        return res.render("login",{
            error:"Invalid credentials"
        });
    }
    const allurls = await URL.find({createdBy:req.user?._id})
    const jwtToken = setUser(user);
    res.cookie("uid",jwtToken);
    return res.render("home",{allurls:allurls});
})

export {
    createUser,
    loginUser
}