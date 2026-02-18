import { useState } from "react";
import FacialExpression from "./components/FacialExpression";
import "./App.css";
import Moodsongs from "./components/Moodsongs";

function App() {
   const [Songs, setSongs] = useState([
    
  ]);
  return (
    <>
      <FacialExpression setSongs={setSongs} />
      <Moodsongs Songs={Songs} />
     
    </>
  );
}

export default App;
