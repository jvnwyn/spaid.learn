import React from "react";

const CourseSidebar = () => (
  <>
    <div className="border-1 border-[rgba(0,0,0,0.25)]  p-5 mb-2">
      <div className="text-gray-500 text-sm mb-1">Uploaded By</div>
      <div className="text-sm text-black">Jovan Wayne Andrade</div>
    </div>
    <div className="border-1 border-[rgba(0,0,0,0.25)]  p-5">
      <div className="text-gray-500 text-sm mb-1">Topics</div>
      <div className="text-sm text-black">
        Lesson 1 - Ready, Sets, Go
        <br />
        Lesson 2 - Setting It Up
        <br />
        Lesson 3 - Falling in Line
      </div>
    </div>
  </>
);

export default CourseSidebar;
