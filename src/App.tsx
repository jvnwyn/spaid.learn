import React from "react";
import "./App.css";
import Login from "./components/Login";
import Navlogged from "./components/Navlogged";
import LearnersCard from "./components/LearnersCard";
import RecoCourse from "./components/RecoCourse";
import Review from "./components/Review";
import QrCom from "./components/QrCom";

function App() {
  return (
    <>
      <Navlogged />

      <div className="flex  ">
        <div className="w-13/20 ">
          <RecoCourse />
          <Review />
          <QrCom />
        </div>
        <div className="w-8/20 ">
          <LearnersCard />
        </div>
      </div>
    </>
  );
}

export default App;
