import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

const CourseHeader = ({ course }: { course: any }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const userId = userRes?.user?.id;
      if (!userId) {
        // not logged in — send to login (adjust route as needed)
        navigate("/login");
        return;
      }

      // check if the user_courses row already exists
      const { data: existing, error: selectErr } = await supabase
        .from("user_courses")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", course.id)
        .maybeSingle();

      if (selectErr) {
        console.warn("Failed to check existing user_course:", selectErr);
      }

      // insert only when no existing row found
      if (!existing) {
        const { error: insertErr } = await supabase
          .from("user_courses")
          .insert([
            {
              user_id: userId,
              course_id: course.id,
              progress: 0,
            },
          ]);

        if (insertErr) {
          console.warn("Insert user_course error:", insertErr);
        }
      }
    } catch (e) {
      console.error("Failed to add user_course:", e);
      // continue to navigate even on error
    } finally {
      setLoading(false);
    }

    // navigate once after all work is done (or skipped)
    navigate(`/view-course/${course.id}`, { state: course });
  };

  return (
    <div>
      <div className="bg-[#F5F5F5] rounded-xl p-7 flex flex-col gap-8 justify-between items-start ">
        <div>
          <div className="text-xl md:text-2xl font-medium mb-2">
            {course.course_name}
          </div>
          <div className="text-sm text-black">{course.course_description}</div>
        </div>
        <button
          type="button"
          onClick={handleStart}
          disabled={loading}
          className="px-6 py-2 border border-[rgba(0,0,0,0.25)] rounded-lg cursor-pointer text-sm bg-white hover:bg-gray-100 self-start md:self-end disabled:opacity-60"
        >
          {loading ? "Starting..." : "Start Learning Now"}
        </button>
      </div>
    </div>
  );
};

export default CourseHeader;
