// import React from "react";
import './App.css';
import ContentsRouter from './components/common/router/ContentsRouter';
import WelcomePage from "@/components/minseok/WelcomePage";

function App() {
  return (
    <div>
        <WelcomePage/>
      <ContentsRouter />
    </div>
  );
}

export default App;
