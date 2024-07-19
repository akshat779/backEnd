import express from 'express';
import path from 'path';
import multer from 'multer';

const app = express();

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return(cb(null , './uploads'))
    },
    filename: function(req,file,cb){
        return cb(null, file.originalname)
    },
})

const upload = multer({storage:storage})

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.render("homepage");
})

app.post("/upload", upload.single("profileImage") ,async(req,res)=>{
    console.log(req.body);
    console.log(req.file)
})

app.listen(8000,()=>{
    console.log("Server is running on port 8000")
})