import express from 'express';

import path from "path";
import cookieParser from "cookie-parser";
import cors from 'cors'


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({
    limit:"16kb"
}));
app.use(express.urlencoded({extended:true}));


app.set("views",path.resolve("src/views"));
app.set("view engine","ejs");

app.use(cookieParser());

import userRoute from "./routes/user.routes.js";    
app.use("/user",userRoute);


export default app;

