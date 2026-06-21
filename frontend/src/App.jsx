import axios from "axios";

function App(){
  async function  testBackend(){
    try{
      const res = await axios.get("http://localhost:3000/problems");
      console.log(res.data);
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div>
      <h1>Runtime</h1>
      <button onClick={testBackend}>
         Test Backend
      </button>
    </div>
  );
}

export default App;
