import express from 'express'
import cors from 'cors' 
import cookieParser from 'cookie-parser'
import path from 'path'
import { URL } from './models/url.models.js'




const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({
    extended:true
}))

app.use(express.static("public"))
app.use(cookieParser())
app.set("view engine","ejs")
app.set("views",path.resolve("./src/views"))
import urlRouter from './routes/url.route.js'
import staticRouter from './routes/staticRouter.route.js'

app.use("/url" ,urlRouter)
app.use("/home",staticRouter)

export {app}