import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { createToken } from '../utils/auth.js'
import { ApiError } from '../utils/ApiError.js'

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/default.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    catch (error) {
        console.log("Error occured in hashing ", error);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function (email, password) {
    
    try {
        console.log(password)
        const val = await bcrypt.compare(password, this.password)
        console.log(val)
        if (!val) {
            throw new ApiError(401, "Password is incorrect");
        }
        const jwtToken = createToken(this);
        return jwtToken;
    }
    catch (error) {
        console.log("Error occured in hashing ", error);
        throw new ApiError(500, "Internal Server Error");
    }

}

const User = model("User", userSchema);

export default User;