import React from "react";

const CourseContentQuestion: React.FC = () => {
  return (
    <div className="w-full h-[50%] border border-[rgba(0,0,0,0.25)] p-4 flex flex-col">
      <div className="text-sm text-black font-semibold mb-2">QUESTION</div>
      <p className="text-[13px] text-black leading-6 mb-4">
        {/* ...existing content... */}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <div className="text-[13px] text-black mb-2">Possible Answers</div>
      <div className="flex flex-col gap-2">
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="answer" className="accent-black" />
          <span className="text-[13px] text-black">Possible Answer #1</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="answer" className="accent-black" />
          <span className="text-[13px] text-black">Possible Answer #2</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="answer" className="accent-black" />
          <span className="text-[13px] text-black">Possible Answer #3</span>
        </label>
      </div>
      <div className="mt-auto flex justify-end">
        <button
          type="button"
          className="border border-[rgba(0,0,0,0.25)] px-4 py-2 text-[13px] text-black rounded"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default CourseContentQuestion;
