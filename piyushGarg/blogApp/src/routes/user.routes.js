import {Router} from "express";
import { createUser,signInUser} from "../controllers/user.controller.js";
const router = Router();

router.get("/signin",(req,res)=>{
    return res.render("signin");
})
router.get("/signup",(req,res) => {
    return res.render("signup");
});

router.get("/home",(req,res)=>{
    return res.render("home");
})

router.post("/signup",createUser);

router.post("/signin",signInUser)

export default router;