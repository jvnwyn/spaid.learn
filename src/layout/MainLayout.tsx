import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import Navlogged from "../components/Navlogged";
import type { User } from "@supabase/supabase-js";

const MainLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
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
=======
  useEffect(() => {
    // Initial session / user setup
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data?.session;
      const user = session?.user || null;
      setUser(user);

      // keep redirects and profile creation as before
      if (user && location.pathname === "/") {
        navigate("/Home", { replace: true });
      }
      if (user && location.pathname === "/reset") {
        navigate("/Home", { replace: true });
      }
      if (
        !user &&
        location.pathname !== "/" &&
        location.pathname !== "/reset"
      ) {
        setUser(null);
        navigate("/", { replace: true });
      }
      if (user) {
>>>>>>> 775d3de (added some loading screen)
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
<<<<<<< HEAD

      if (authUser && location.pathname === "/") {
        navigate("/Home", { replace: true });
      }
    })();
=======
    });

    // Listen for auth changes and set/remove token when user signs in/out
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          sessionStorage.setItem("token", JSON.stringify(session));
        } else if (event === "SIGNED_OUT") {
          sessionStorage.removeItem("token");
        }
      }
    );

    return () => {
      // cleanup auth listener
      authListener?.subscription?.unsubscribe?.();
    };
>>>>>>> 775d3de (added some loading screen)
  }, [location.pathname, navigate]);

  return (
    <>
      <Navlogged />
      <Outlet />
    </>
  );
};

export default MainLayout;