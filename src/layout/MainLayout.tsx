import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import Navlogged from "../components/Navlogged";
import type { User } from "@supabase/supabase-js";

const MainLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  async function generateUniqueUsername() {
    for (let i = 0; i < 10; i++) {
      const candidate = "user" + Math.floor(1000 + Math.random() * 9000);
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", candidate)
        .limit(1);
      if (!existing || (Array.isArray(existing) && existing.length === 0)) return candidate;
    }
    return "user" + Date.now().toString().slice(-4);
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const authUser = data?.user ?? null;
      setUser(authUser);

      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (!profile) {
          let username = localStorage.getItem("pending_username") ?? null;
          if (!username) {
            username = authUser.user_metadata?.full_name ??
                       authUser.user_metadata?.name ??
                       (await generateUniqueUsername());
          }

          await supabase.from("profiles").upsert(
            {
              id: authUser.id,
              username,
              role: "student",
              created_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          localStorage.removeItem("pending_username");
        }
      } else {
        if (location.pathname !== "/" && location.pathname !== "/reset") {
          navigate("/", { replace: true });
        }
      }

      if (authUser && location.pathname === "/") {
        navigate("/Home", { replace: true });
      }
    })();
  }, [location.pathname, navigate]);

  return (
    <>
      <Navlogged />
      <Outlet />
    </>
  );
};

export default MainLayout;