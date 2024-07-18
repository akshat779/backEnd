import mongoose, { Schema } from "mongoose";
import  {User} from "./users.models.js"

const urlSchema = new Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    visitHistory: [{
        timeStamp: {
            type: Date
        }
    }],

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: User,
    }


}, { timestamps: true })

export const URL = mongoose.model("Url", urlSchema)