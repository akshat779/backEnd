import jwt from 'jsonwebtoken'

const setUser = (id,user) => {
    console.log(user)
    const payload = {
        _id:user._id,
        email:user.email,
    }
    const sad =  jwt.sign(payload,"akshat", {expiresIn:"1d"})
    console.log(sad)
    return sad;
}

const getUser = (token) =>{
    // console.log(token)
    if(!token){
        return null;
    }
    return  jwt.verify(token,"akshat")
}

export{
    setUser,
    getUser
}