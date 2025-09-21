import React from "react";
import RecoCourse from "../components/RecoCourse";
import Review from "../components/Review";
import QrCom from "../components/QrCom";
import LearnersCard from "../components/LearnersCard";

const HomePage = () => {
  return (
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
  );
};

export default HomePage;
