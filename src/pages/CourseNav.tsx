import React, { useEffect, useState } from "react";
import supabase from "@/config/supabaseClient";
import { Link } from "react-router-dom";

interface Course {
  id: string;
  course_name: string | null;
  course_description: string | null;
}

const CourseNav: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("course_id")
        .select("id, course_name, course_description");
      if (error) {
        setError(error.message);
      } else {
        setCourses((data as Course[]) || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? courses.filter(
        (c) =>
          c.course_name?.toLowerCase().includes(q) ||
          c.course_description?.toLowerCase().includes(q)
      )
    : courses;

  return (
    <div className="w-full mx-auto p-8 pt-20 ">
      <div className="flex w-[50%] items-center gap-2 ml-5 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses..."
          className="w-full border border-[rgba(0,0,0,0.25)] rounded px-3 py-2 text-sm text-black"
        />
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="border border-[rgba(0,0,0,0.25)] rounded px-3 py-2 text-sm text-black cursor-pointer"
        >
          Clear
        </button>
      </div>

      {loading && <div className="text-sm text-black">Loading...</div>}
      {error && !loading && (
        <div className="text-sm text-red-600">Error: {error}</div>
      )}

      {!loading && !error && (
        <div className=" p-3">
          {filtered.length === 0 ? (
            <div className="p-4 text-sm text-black">No courses found.</div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {filtered.map((c) => (
                <Link
                  to={`/course/${c.id}`}
                  key={c.id}
                  className="border border-[rgba(0,0,0,0.25)] py-5 rounded p-3"
                >
                  <div className="text-sm text-black font-medium">
                    {c.course_name || "Untitled course"}
                  </div>
                  {c.course_description && (
                    <div className="text-[12px] text-black/70 mt-1">
                      {c.course_description}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseNav;
