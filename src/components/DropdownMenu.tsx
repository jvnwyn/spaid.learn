import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import supabase from "../config/supabaseClient";

const DropdownMenu = () => {
  const navigate = useNavigate();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    sessionStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="absolute bg-white right-2 md:right-8 rounded-lg border border-[rgba(0,0,0,0.15)] top-18 min-w-[160px] shadow-md z-50 overflow-hidden">
      <ul className="flex flex-col">
        <li>
          <Link
            to="/AccountSetting"
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaUser size={14} className="text-gray-400" />
            Profile
          </Link>
        </li>
        <li className="border-t border-[rgba(0,0,0,0.1)]">
          <button
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full cursor-pointer"
            onClick={signOut}
          >
            <FaSignOutAlt size={14} className="text-gray-400" />
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
