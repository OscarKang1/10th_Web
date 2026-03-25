import './App.css'
import {useState}  from 'react';

function App() {
  const[count, setCount] = useState(0) 

  const handleIncreaseNumber = () => {
    setCount(count+1)
  }

  return (
    <>
    <h1>{count}</h1>
    <button onClick= {handleIncreaseNumber}>숫자 증가 </button>
    </>
  )
}

export default App
