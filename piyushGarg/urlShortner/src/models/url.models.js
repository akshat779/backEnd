import mongoose ,{Schema} from "mongoose";

const urlSchema = new Schema({
    shortId:{
        type:String,
        required:true,
        unique:true
    },
    redirectUrl:{
        type:String,
        required:true
    },
    visitHistory:[{
        timeStamp:{
            type:Date 
        }
    }]

},{timestamps:true})

export const URL = mongoose.model("Url",urlSchema)