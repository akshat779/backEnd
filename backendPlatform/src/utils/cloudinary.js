import {v2 as cloudinary} from "cloudinary"
import {ApiError} from "../utils/ApiError.js"
import fs from "fs" 

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath){
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // console.log("Uploaded successfully", response.url);
        fs.unlinkSync(localFilePath);
        // console.log(response.public_id)
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath);
        return null
    }
}

const deleteFromCloudinary = async(imageurl) => {
    try{
        // console.log(imageurl)
        const publicId = imageurl.split("/").pop().split(".")[0]
        await cloudinary.uploader.destroy(publicId)
    }
    catch(error){
        throw new ApiError(500,error.message)
    }
}

export {uploadOnCloudinary,deleteFromCloudinary}