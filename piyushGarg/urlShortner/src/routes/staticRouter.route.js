import {Router} from 'express'
import { URL } from '../models/url.models.js'

const router = Router()

router.get('/', async(req,res)=>{
    const allurls = await URL.find({})
    res.render("home",{allurls});
})


export default router