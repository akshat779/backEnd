import { Router } from 'express'
import { createShortUrl, getShortUrl } from '../controllers/url.controller.js'

const router = Router()

router.post('/',createShortUrl)
router.get('/:id',getShortUrl)

export default router;