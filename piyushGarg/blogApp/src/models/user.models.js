import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:"/images/default.png"
    },
    role:{
        type: String,
        enum:["USER","ADMIN"],
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    const user = this;
    if(!user.isModified("password")){
        return next();
    }
    try{
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    catch(error){
        console.log("Error occured in hashing ", error);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    try{
        
        return bcrypt.compare(password,this.password)
    }
    catch(error){
        console.log("Error occured in hashing ", error);
        return false;
    }
    
}

const User = model("User",userSchema);

export default User;