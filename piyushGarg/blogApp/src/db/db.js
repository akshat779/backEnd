import mongoose from "mongoose"


const connectDB = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("Database connected");
        
    } catch (error) {
        console.log("Error occured in connecting to the DB ", error);
        process.exit(1)
    }
}

export default connectDB;