import express from 'express';
import cors from 'cors';
const port = process.env.PORT || 3000;
const app = express();

// give me an object containing 5 jokes along with their punchlines

app.use(cors({
    origin:'http://localhost:5173'
}));

const jokes = [
    {
        joke: "Why did the scarecrow win an award?",
        punchline: "Because he was outstanding in his field."
    },
    {
        joke: "Why did the tomato turn red?",
        punchline: "Because it saw the salad dressing!"
    },
    {
        joke: "What do you call a fake noodle?",
        punchline: "An impasta!"
    },
    {
        joke: "Why did the coffee file a police report?",
        punchline: "It got mugged."
    },
    {
        joke: "Why did the math book look sad?",
        punchline: "Because it had too many problems."
    }
]


app.get('/api/jokes',(req,res)=>{
    res.send(jokes);
})

app.listen(port,()=>{
    console.log("Server is running on port 3000")
})