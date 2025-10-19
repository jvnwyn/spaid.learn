import { useEffect, useState } from "react";
import Avatarcard from "../assets/img/defAvatar.svg";
import { Link } from "react-router-dom";

import supabase from "../config/supabaseClient";

const LearnersCard = () => {
  const [authUser, setAuthUser] = useState<any>(null);
  const [role, setRole] = useState<string>("Learner");
  const [username, setUsername] = useState<string | null>(null);

  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user ?? null;
        if (!mounted) return;
        setAuthUser(user);

        if (user?.id) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("username, role")
            .eq("id", user.id)
            .single();

          if (!error && profile) {
            if (mounted) {
              setRole(profile.role ?? "Learner");
              setUsername(profile.username ?? null);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load user/profile", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);
  const displayName =
    authUser?.user_metadata?.full_name
      ? authUser.user_metadata.full_name.split(" ")[0]
      : authUser?.user_metadata?.name ?? username ?? "Learner";

  console.log("Token in LearnersCard:", token);

  return (
    <div className="w-full lg:px-10 flex flex-col md:px-20 gap-6 items-center lg:items-start lg:mt-25 py-4  lg:ml-[-100px] ">
      {/* Profile Card */}
      <div className="w-full  lg:max-w-md hidden border-1 border-[rgba(0,0,0,0.25)] md:flex  overflow-hidden bg-white">
        <div className="w-2/5 flex flex-col border-r-1 border-[rgba(0,0,0,0.25)]">
          <Link
            to="/AccountSetting"
            className="h-full flex flex-col justify-center items-center py-4"
          >
            <img
              src={token?.user?.user_metadata?.avatar_url || Avatarcard}
              alt=""
              className="w-20 bg-[#f5f5f5] rounded-full"
            />
            <div className="flex flex-col justify-center items-center mt-2">
              <h1 className="text-lg">
                {displayName}
              </h1>
              <p className="text-xs text-[#403F3F] border-1 border-[rgba(0,0,0,0.25)] px-2 rounded-3xl">
                {role}
              </p>
            </div>
          </Link>
        </div>
        <div className="w-3/5 bg-[#f5f5f5] flex flex-col justify-between items-center py-4">
          <div className="w-full flex flex-col justify-center px-4">
            <h1 className="text-[#403F3F]">Courses Completed</h1>
            <h1 className="text-xl">0</h1>
          </div>
          <div className="flex items-center w-4/5 py-3">
            <hr className="flex-grow border-t border-gray-300"></hr>
          </div>
          <div className="w-full flex flex-col justify-center px-4">
            <h1 className="text-[#403F3F]">Ongoing Courses</h1>
            <h1 className="text-xl">0</h1>
          </div>
        </div>
      </div>

      {/* Continue Learning Card */}
      <div className="w-full lg:max-w-md border-1 border-[rgba(0,0,0,0.25)] flex  overflow-hidden bg-white">
        <div className="flex-1 flex flex-col p-5 gap-2">
          <h1 className="text-xs text-center border-1 border-[rgba(0,0,0,0.25)] rounded-full px-4 py-0.5 w-fit mx-auto md:mx-0">
            Continue Learning
          </h1>
          <h1 className="text-base font-semibold">
            MATHEMATICAL AND PROBLEM-SOLVING SKILLS II
          </h1>
          <p className="text-xs text-gray-600">25% Completed</p>
        </div>
        <div className="flex justify-center items-end p-4">
          <a href="#" className="text-[#013F5E] font-medium">
            View Course
          </a>
        </div>
      </div>
    </div>
  );
};

export default LearnersCard;
