import { asyncHandler } from "../utils/asyncHandler.js";
import { getUser } from "../utils/auth.js";


const restrictToLoginUserOnly = asyncHandler(async(req,res,next) => {
    const uid = req.cookies?.uid;
    if(!uid){
        return res.redirect("/login");
    }
    const user = getUser(uid);
    if(!user){
        return res.redirect("/login");
    }
    req.user = user;
    next();

})

const checkAuth = asyncHandler(async(req,res,next) => {
    const uid = req.cookies?.uid;
   
    const user = getUser(uid);
   
    req.user = user;
    next();

})

export{
    restrictToLoginUserOnly,
    checkAuth
}