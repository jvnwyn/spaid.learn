import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import supabase from "../config/supabaseClient";

const AccountSettCourses = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Read token once on mount to derive a stable userId
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("token");
      const parsed = raw ? JSON.parse(raw) : null;
      setUserId(parsed?.user?.id ?? null);
    } catch {
      setUserId(null);
    }
  }, []);

  // Fetch role when userId is available (stable dependency)
  useEffect(() => {
    async function fetchUserRole() {
      setLoading(true);
      if (!userId) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching role:", error.message);
      } else {
        setRole(data?.role || null);
      }
      setLoading(false);
    }

    fetchUserRole();
  }, [userId]);

  if (loading) {
    // Skeleton while loading
    return (
      <div className="p-8 md:px-15 lg:px-30">
        <div className="w-full gap-5 md:gap-10 flex flex-col md:flex-row justify-between bg-[#f5f5f5] rounded-xl md:p-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 px-3 flex flex-col justify-between">
              <div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-3 animate-pulse" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse" />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:px-15 lg:px-30">
      <div className="w-full gap-5 md:gap-10  flex flex-col md:flex-row justify-between bg-[#f5f5f5] rounded-xl md:p-5">
        {role === "instructor" && (
          <div className="flex-1 px-3 flex flex-col justify-between">
            <div>
              <h1 className="text-lg font-medium mb-3">My courses</h1>
              <div className="flex flex-col gap-2 text-sm md:text-base">
                <p>LS1 ENG - I GET IT (RECOGNIZING THE MAIN IDEA)</p>
                <p>LS1 ENG - IN OTHER WORDS (RESTATING INFORMATION)</p>
                <p>LS1 ENG - I MYSELF BELIEVE (EXPRESSING OPINIONS)</p>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button className="text-[#013F5E] flex items-center gap-2 hover:underline cursor-pointer">
                Show more <FaChevronDown />
              </button>
            </div>
          </div>
        )}

        {role === "instructor" && (
          <div className="block h-[1px] md:h-auto md:my-5 md:w-[2px] bg-gray-300 mx-2"></div>
        )}

        <div className="flex-1 px-3 flex flex-col justify-between">
          <div>
            <h1 className="text-lg font-medium mb-3">Unfinished courses</h1>
            <div className="flex flex-col gap-2 text-sm md:text-base">
              <p>LS1 ENG - I GET IT (RECOGNIZING THE MAIN IDEA)</p>
              <p>LS1 ENG - IN OTHER WORDS (RESTATING INFORMATION)</p>
              <p>LS1 ENG - I MYSELF BELIEVE (EXPRESSING OPINIONS)</p>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button className="text-[#013F5E] flex items-center gap-2 hover:underline cursor-pointer">
              Show more <FaChevronDown />
            </button>
          </div>
        </div>

        <div className="block h-[1px] md:h-auto md:my-5 md:w-[2px] bg-gray-300 mx-2"></div>

        <div className="flex-1 px-3 flex flex-col justify-between">
          <div>
            <h1 className="text-lg font-medium mb-3">Finished courses</h1>
            <div className="flex flex-col gap-2 text-sm md:text-base">
              <p>LS1 ENG - I GET IT (RECOGNIZING THE MAIN IDEA)</p>
              <p>LS1 ENG - IN OTHER WORDS (RESTATING INFORMATION)</p>
              <p>LS1 ENG - I MYSELF BELIEVE (EXPRESSING OPINIONS)</p>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button className="text-[#013F5E] flex items-center gap-2 hover:underline cursor-pointer">
              Show more <FaChevronDown />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettCourses;
