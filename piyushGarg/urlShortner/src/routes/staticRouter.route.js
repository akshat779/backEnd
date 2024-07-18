import {Router} from 'express'
import { URL } from '../models/url.models.js'

const router = Router()

router.get('/', async(req,res)=>{
    if(!req.user){
        return res.redirect("/login");
    }
    const allurls = await URL.find({createdBy:req.user._id})
    res.render("home",{allurls:allurls});
})

router.get('/signup', (req,res)=>{
    res.render("signup")
})
router.get('/login', (req,res)=>{
    res.render("login")
})

export default router