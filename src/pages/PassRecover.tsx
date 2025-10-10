import React, { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const PassRecover = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to home
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/Home");
    }
    // If not in recovery session, redirect to login
    supabase.auth.getSession().then(({ data }) => {
      if (!data?.session || !data.session.user) {
        // Not in a valid session, but Supabase will allow password change only if in recovery
        // If not in recovery, redirect to login
        if (!data?.session?.user?.email_confirmed_at) {
          navigate("/");
        }
      }
    });
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password has been reset successfully.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleResetPassword}
        className="bg-[#f5f5f5] border border-[rgba(0,0,0,0.25)] p-8 shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-[rgba(0,0,0,0.25)] p-2 rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-[rgba(0,0,0,0.25)] p-2 rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-[#013F5E] text-white py-2 rounded-md"
        >
          Reset Password
        </button>
        {message && <div className="text-green-600 text-sm">{message}</div>}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
    </div>
  );
};

export default PassRecover;
