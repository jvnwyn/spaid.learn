import React from "react";
import CourseHeader from "../components/CourseHeader";
import CourseSidebar from "../components/CourseSidebar";
import CourseDescription from "../components/CourseDescription";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
const CoursePage = () => {
  return (
    <div className="bg-white  min-h-screen px-10 md:px-25 pt-30 py-6">
      <Link
        to="/Home"
        className="absolute top-20 left-15 text-[rgba(0,0,0,0.25)] flex justify-center items-center gap-2"
      >
        <FaChevronLeft />
        Back
      </Link>
      <CourseHeader />
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <div className="flex-1">
          <CourseDescription />
        </div>
        <div className="flex flex-col gap-6 w-full md:w-[340px]">
          <CourseSidebar />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
