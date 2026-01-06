import { useEffect, useState } from "react";
import Avatarcard from "../assets/img/defAvatar.svg";
import { Link } from "react-router-dom";

import supabase from "../config/supabaseClient";
import ContinueLearning from "./ContinueLearning";

const LearnersCard = () => {
  const [authUser, setAuthUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [unfinishedCourses, setUnfinishedCourses] = useState<any[]>([]);
  const [finishedCourses, setFinishedCourses] = useState<any[]>([]);
  const [uploadedCourses, setUploadedCourses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isInstructor, setIsInstructor] = useState(false);

  // Fetch user and profile first
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user ?? null;
        const rawToken = sessionStorage.getItem("token");
        const parsedToken = rawToken ? JSON.parse(rawToken) : null;
        setToken(parsedToken);

        if (!mounted) return;
        setAuthUser(user);

        if (user?.id) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("username, role, avatar_url")
            .eq("id", user.id)
            .single();

          console.log("Profile data:", profile);

          if (!error && profile && mounted) {
            const userRole = (profile.role ?? "Learner").trim();
            const instructorCheck = userRole.toLowerCase() === "instructor";
            
            console.log("Role:", userRole, "Length:", userRole.length);
            console.log("Is instructor:", instructorCheck);
            
            setRole(userRole);
            setIsInstructor(instructorCheck);
            setUsername(profile.username ?? null);
            setAvatarUrl((profile as any).avatar_url ?? null);
          }
        }
      } catch (err) {
        console.error("Failed to load user/profile", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch uploaded courses for instructors
  useEffect(() => {
    if (!authUser?.id || !isInstructor) return;

    const fetchUploadedCourses = async () => {
      console.log("Fetching uploaded courses for instructor:", authUser.id);

      const { data, error } = await supabase
        .from("course_id")
        .select("id")
        .eq("uploader_id", authUser.id);

      console.log("Uploaded courses result:", { data, error, count: data?.length });

      if (!error) {
        setUploadedCourses(data?.length ?? 0);
      }
    };

    fetchUploadedCourses();
  }, [authUser?.id, isInstructor]);

  // Fetch courses for learners
  useEffect(() => {
    if (!authUser?.id || isInstructor) return;

    const fetchCourses = async () => {
      try {
        const { data: finished } = await supabase
          .from("user_courses")
          .select(`progress, course_id (id, course_name)`)
          .eq("user_id", authUser.id)
          .eq("progress", 100);

        setFinishedCourses(finished || []);

        const { data: unfinished } = await supabase
          .from("user_courses")
          .select(`progress, course_id (id, course_name)`)
          .eq("user_id", authUser.id)
          .lt("progress", 100);

        setUnfinishedCourses(unfinished || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [authUser?.id, isInstructor]);

  // Debug log
  console.log("Render - loading:", loading, "role:", role, "isInstructor:", isInstructor);

  // Skeleton while loading
  if (loading || role === null) {
    return (
      <div className="w-full lg:px-10 flex flex-col md:px-20 gap-6 items-center lg:items-start lg:mt-25 py-4 lg:ml-[-100px]">
        <div className="w-full lg:max-w-md hidden border-1 border-[rgba(0,0,0,0.25)] md:flex overflow-hidden bg-white p-4">
          <div className="w-2/5 flex flex-col border-r-1 border-[rgba(0,0,0,0.25)] items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-3/5 bg-[#f5f5f5] flex flex-col justify-center items-center py-4 px-4">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    username?.split(" ")[0] ||
    authUser?.user_metadata?.full_name?.split(" ")[0] ||
    "User";

  return (
    <div className="w-full lg:px-10 flex flex-col md:px-20 gap-6 items-center lg:items-start lg:mt-25 py-4 lg:ml-[-100px]">
      {/* Profile Card */}
      <div className="w-full lg:max-w-md hidden md:flex overflow-hidden bg-white">
        <div className="w-2/5 flex flex-col border-r-1 border-[rgba(0,0,0,0.25)]">
          <Link
            to="/AccountSetting"
            className="h-full flex flex-col justify-center items-center py-4"
          >
            <img
              src={
                avatarUrl ||
                token?.user?.user_metadata?.avatar_url ||
                Avatarcard
              }
              alt=""
              className="w-20 h-20 bg-[#f5f5f5] rounded-full object-cover"
            />
            <div className="flex flex-col justify-center items-center mt-2">
              <h1 className="text-lg">{displayName}</h1>
              <p className="text-xs border-1 px-2 rounded-3xl bg-[#ff0300] text-white">
                {role}
              </p>
            </div>
          </Link>
        </div>
        <div className="w-3/5 bg-[#f5f5f5] flex flex-col justify-center items-center py-4">
          {isInstructor ? (
            <div className="w-full flex flex-col justify-center px-4">
              <h1 className="text-[#403F3F]">Courses Uploaded</h1>
              <h1 className="text-xl ">{uploadedCourses}</h1>
            </div>
          ) : (
            <>
              <div className="w-full flex flex-col justify-center px-4">
                <h1 className="text-[#403F3F]">Courses Completed</h1>
                <h1 className="text-xl">{finishedCourses.length}</h1>
              </div>
              <div className="flex items-center w-4/5 py-3">
                <hr className="flex-grow border-t border-gray-300" />
              </div>
              <div className="w-full flex flex-col justify-center px-4">
                <h1 className="text-[#403F3F]">Ongoing Courses</h1>
                <h1 className="text-xl">{unfinishedCourses.length}</h1>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Continue Learning Card - only show for learners */}
      {!isInstructor && <ContinueLearning user_id={authUser?.id} />}
    </div>
  );
};

export default LearnersCard;