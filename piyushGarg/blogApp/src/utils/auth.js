import jwt from 'jsonwebtoken';
// import User from "../models/user.models";

function createToken(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileImage:user.profileImageUrl,
        role: user.role,
    }
    const jwtToken = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:process.env.EXPIRES_IN});
    return jwtToken;
}


function verifyToken(token){
    return jwt.verify(token,process.env.SECRET_KEY);
}

export {
    createToken,
    verifyToken
}