import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

const CourseSidebar = ({ course }: { course: any }) => {
  const [uploaderName, setUploaderName] = useState<string>("");
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!course) {
          // fallback to current authenticated user name
          const { data } = await supabase.auth.getUser();
          const user = data?.user ?? null;
          if (!mounted) return;
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", course.uploader_id)
          .maybeSingle();

        if (!mounted) return;

        if (!error && profile?.username) {
          setUploaderName(profile.username);
        } else {
          // fallback to fetching auth user name if profile not found
          const { data } = await supabase.auth.getUser();
          const user = data?.user ?? null;
          const display = uploaderName;
          ("Unknown uploader");
          setUploaderName(display);
        }
      } catch (err) {
        if (mounted) setUploaderName("Unknown uploader");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [course]);

  return (
    <>
      <div className="border-1 border-[rgba(0,0,0,0.25)]  p-5 mb-2">
        <div className="text-gray-500 text-sm mb-1">Uploaded By</div>
        <div className="text-sm text-black">
          {uploaderName || "Unknown uploader"}
        </div>
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
};

export default CourseSidebar;
// ...existing code...
