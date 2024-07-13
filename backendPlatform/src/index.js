import dotenv from "dotenv"
import connectDB from "./db/database.js";
import {app} from "./app.js"

dotenv.config({
    path:"./env"
})



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,() =>{
        console.log(`Server started at port ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("Error occured in connecting to the DB ",error);
})





















































