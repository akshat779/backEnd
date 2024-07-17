import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import data from './data.js';
import mongoose from 'mongoose';

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    // fs.appendFileSync('./logs.txt',`${Date.now()} : ${req.method} : ${req.url}`)
   next();
})

mongoose.connect('mongodb://localhost:27017/users')
.then(()=>{
    console.log('Connected to mongodb');
})
.catch((error)=>{
    console.log('Error connecting to mongodb',error);
})

const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    job_title:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:["M","F", "O"]
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);

app.get('/users',async (req,res)=>{
    const allUsers = await User.find({});
    const html = `
    <ul>
        ${allUsers.map((users)=>{
            return `<li> ${users.first_name} : ${users.id} </li>`
        }).join("")}
    </ul>`;
    res.send(html);
})

app.get('/api/users',(req,res)=>{
    res.status(200).json(data);
})

app.get('/api/users/:id',async(req,res)=>{
    const id = (req.params.id);
    const user = await User.findById(id);
    res.json(user);
})

app.post("/api/users", async(req,res)=>{
    const{id,first_name,last_name,email,gender,job_title} = req.body;

    // const newUser =  new User({
    //     first_name,
    //     last_name,
    //     email,
    //     job_title,
    //     gender
    // })
    if(!first_name || !last_name || !email || !job_title){
        return res.status(400).json({message:"Please enter all the fields"});
    }

    const user = await User.create({
        first_name,
        last_name,
        email,
        job_title,
        gender
    })


    res.status(200).json(user);
})



app.listen(3000,() => {
    console.log('server started');
})