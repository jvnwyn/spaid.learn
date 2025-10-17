import React from "react";
import CourseOverviewCard from "../components/CourseOverviewCard";
import CourseContentCard from "../components/CourseContentCard";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

const ViewCoursePage = () => {
  return (
    <div className="bg-white min-h-screen p-15 flex flex-col">
      <Link
        to="/course"
        className="absolute top-20 left-15 text-[rgba(0,0,0,0.25)] flex justify-center items-center gap-2"
      >
        <FaChevronLeft />
        Learn / Courses / LS1 ENG - I GET IT
      </Link>
      <div className="flex-1 flex flex-col md:flex-row gap-8 mt-20  items-stretch">
        <CourseOverviewCard />
        <CourseContentCard />
      </div>
    </div>
  );
};

export default ViewCoursePage;
