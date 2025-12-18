import React, { useState } from "react";
import supabase from "../config/supabaseClient";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/passRecover",
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent. Please check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      <Link
        to="/"
        className="absolute top-20 text-sm hover:underline left-20 text-[rgba(0,0,0,0.25)] flex justify-center items-center gap-2"
      >
        <FaChevronLeft size={13} />
        back
      </Link>
      <form
        onSubmit={handleSubmit}
        className="bg-[#f5f5f5] border border-[rgba(0,0,0,0.25)] p-8  shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-[rgba(0,0,0,0.25)] p-2 rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-[#013F5E] text-white py-2 rounded-md"
        >
          Send Reset Link
        </button>
        {message && <div className="text-green-600 text-sm">{message}</div>}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
    </div>
  );
};

export default ForgetPass;
