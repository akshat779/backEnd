import app from "./app.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})


connectDB()
.then(() => {
    app.listen(process.env.PORT , () => {
        console.log(`Server started on port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("Error in connecting to the DB ", error);
})