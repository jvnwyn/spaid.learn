import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import pallete from "../assets/img/pallete.png";

interface FinishedCourse {
  course_id: string;
  course_name: string | null;
}

const Review = () => {
  const navigate = useNavigate();
  const [finishedCourses, setFinishedCourses] = useState<FinishedCourse[]>([]);
  const [displayCourses, setDisplayCourses] = useState<FinishedCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetchFinishedCourses = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) setFinishedCourses([]);
          return;
        }

        const { data: progressData, error: progressError } = await supabase
          .from("user_course_progress")
          .select("course_id")
          .eq("user_id", user.id)
          .eq("completed", true);

        if (progressError || !progressData || progressData.length === 0) {
          if (mounted) setFinishedCourses([]);
          return;
        }

        const courseIds = progressData.map((p) => p.course_id);
        const { data: courseData, error: courseError } = await supabase
          .from("course_id")
          .select("id, course_name")
          .in("id", courseIds);

        if (courseError || !courseData) {
          if (mounted) setFinishedCourses([]);
          return;
        }

        const courses: FinishedCourse[] = courseData.map((c) => ({
          course_id: c.id,
          course_name: c.course_name,
        }));

        if (mounted) {
          setFinishedCourses(courses);
          const shuffled = [...courses].sort(() => Math.random() - 0.5);
          setDisplayCourses(shuffled.slice(0, 3));
        }
      } catch (e) {
        console.error("Error fetching finished courses:", e);
        if (mounted) setFinishedCourses([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFinishedCourses();
    return () => {
      mounted = false;
    };
  }, []);

  const handleReviewClick = (courseId?: string) => {
    if (courseId) {
      navigate(`/start-quiz/${courseId}`);
    }
  };

  if (loading) {
    return null;
  }

  if (finishedCourses.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col px-4 md:px-20 pt-5 gap-5">
      <div className="w-full max-w-[880px] h-auto bg-white rounded-2xl p-4 flex flex-col justify-center gap-2 mx-auto">
        <h1>Reviewer</h1>
        <div className="w-full flex flex-col md:flex-row justify-between items-stretch gap-4">
          {displayCourses.map((course) => (
            <button
              key={course.course_id}
              onClick={() => handleReviewClick(course.course_id)}
              style={{ backgroundImage: `url(${pallete})` }}
              className="flex-1 min-w-0 h-24 md:h-28 rounded-xl flex justify-center items-center shadow-sm bg-cover bg-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span
                className="text-white text-sm text-center font-semibold px-3 w-full"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  wordBreak: "break-word",
                }}
              >
                {course.course_name || "Untitled Course"}
              </span>
            </button>
          ))}
          {displayCourses.length < 3 &&
            Array.from({ length: 3 - displayCourses.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex-1 min-w-0 h-24 md:h-28 rounded-xl flex justify-center items-center bg-gray-200 opacity-40"
              >
                <span className="text-gray-500 text-sm text-center">
                  Empty slot
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Review;