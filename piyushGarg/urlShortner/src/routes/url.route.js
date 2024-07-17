import { Router } from 'express'
import { analytics, createShortUrl, getShortUrl } from '../controllers/url.controller.js'

const router = Router()

router.post('/',createShortUrl)
router.get('/:id',getShortUrl)
router.get('/analytics/:id',analytics)

// router.get("/home",async(req,res)=>{
//     res.render("home")
// })

export default router;