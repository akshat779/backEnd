
import mongoose from 'mongoose'



const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connection at host");
    } catch (error) {
        console.log("Error occured in connecting to the DB ",error);
        process.exit(1);
    }
}

export default connectDB;