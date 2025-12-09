import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

interface Props {
  courseName?: string | null;
}

const CourseContentOverview: React.FC<Props> = ({ courseName }) => {
  return (
    <div className="w-full h-[49%] border flex flex-col items-center border-[rgba(0,0,0,0.25)] p-4">
      <div className="flex items-center  justify-center gap-3 mb-5">
        <FaChevronLeft className="cursor-pointer text-[#7E7E7E] text-xl" />
        <h1 className="text-xl text-black font-semibold uppercase">
          {courseName}
        </h1>
        <FaChevronRight className="cursor-pointer text-[#7E7E7E] text-xl" />
      </div>

      <p className="text-[13px] text-black leading-6 px-3">
        {/* ...existing content... */}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  );
};

export default CourseContentOverview;
