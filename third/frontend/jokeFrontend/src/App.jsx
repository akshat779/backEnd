import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios'
import './App.css'

function App() {
  const [jokes,setJokes] = useState([]);
  useEffect(()=> {
    axios.get('/api/jokes')
    .then((response)=>{
      console.log(response);
      setJokes(response.data)
    })
    .catch((error)=>{
      console.log(error);
    })
  },[])
  return (
    <>
     <h1>Chai Aur Code</h1>
     <p>Jokes : {jokes.length}</p>
     {jokes.map((joke,index) => (
      <div key={index}>
        <hr />
        <h1>{joke.joke}</h1>
        <h2>{joke.punchline}</h2>
        <br />
     
      </div>
     ))}
    </>
  )
}

export default App
