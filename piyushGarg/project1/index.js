import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import data from './data.js';

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



app.get('/users',(req,res)=>{
    const html = `
    <ul>
    ${data.map((user)=>(
         `<li>${user.first_name}</li>`
        )).join('')}
    </ul>
    `;
    res.send(html);
})

app.get('/api/users',(req,res)=>{
    res.json(data);
})

app.get('/api/users/:id',(req,res)=>{
    const id = Number(req.params.id);
    const user = data.find((user) => user.id === id);
    res.json(user);
})

app.post("/api/users",(req,res)=>{
    const{id,first_name,last_name,email,gender,job_title} = req.body;
    const newUser = {
        id,
        first_name,
        last_name,
        email,
        job_title
    }
    data.push(newUser);
    fs.writeFileSync('./data.js', "export deafult")
    fs.appendFile('./data.js', JSON.stringify(data), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('User added to data.js');
    });
   
    res.status(200).json(newUser);
})

app.listen(3000,() => {
    console.log('server started');
})