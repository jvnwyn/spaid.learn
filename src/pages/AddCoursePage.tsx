import React from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

const AddCoursePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Link
        to="/AccountSetting"
        className="absolute top-20 left-15 text-[rgba(0,0,0,0.25)] flex justify-center items-center gap-2"
      >
        <FaChevronLeft />
        Learn / Profile / Add Course
      </Link>
      <div className=" w-full max-w-4xl border border-[rgba(0,0,0,0.25)] px-10 py-5 mt-15">
        <h2 className="text-lg font-medium text-center mb-8">Add Course</h2>
        <form>
          <div className="mb-3">
            <label className="block mb-2 text-sm">Course Name</label>
            <input
              type="text"
              placeholder="Enter Course Name"
              className="w-full border border-[rgba(0,0,0,0.25)] rounded-lg px-4 py-2 focus:outline-none text-sm"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-2 font-medium text-sm">
              Course Description
            </label>
            <textarea
              placeholder="Enter Course Description"
              className="w-full border rounded-lg px-4 py-2 h-24  border-[rgba(0,0,0,0.25)] resize-none focus:outline-none text-sm"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-2 font-medium text-sm">
              Course Files
            </label>
            <div className="border-2 border-dashed border-[rgba(0,0,0,0.25)] bg-[#7e7e7e13] rounded-lg flex flex-col items-center justify-center h-[145px] text-gray-500 text-sm">
              <svg width="32" height="32" fill="none" className="mb-2">
                <path
                  d="M16 6v20M6 16h20"
                  stroke="#888"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Drag and drop files here</span>
              <span className="text-xs text-gray-400 mt-1">
                or click to browse
              </span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-100 px-8 py-2 rounded-lg  font-medium text-sm"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoursePage;
