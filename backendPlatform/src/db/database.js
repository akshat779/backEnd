import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDb connected ! DB Host :",connectionInstance.connection.host);
        // console.log(connectionInstance);
    }
    catch(error){
        console.log("Error occured in connecting to the DB ",error);
        process.exit(1);
    }
}

export default connectDB;