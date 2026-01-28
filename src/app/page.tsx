"use client";

import { useState, useEffect } from "react";
import { type Session } from "@supabase/supabase-js";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";
import LoginPage from "@/components/LoginPage";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [view, setView] = useState<"landing" | "login" | "dashboard">("landing");
  const [session, setSession] = useState<Session | null>(null);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setView("dashboard");
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        setView("login");
      } else if (session) {
        setView("dashboard");
      } else {
        setView("landing");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main>
      {view === "landing" && (
        <LandingPage onStart={() => setView("login")} />
      )}

      {view === "login" && (
        <LoginPage
          onLogin={() => setView("dashboard")}
          initialView={recoveryMode ? 'update-password' : 'login'}
        />
      )}

      {view === "dashboard" && (
        <Dashboard onLogout={async () => {
          await supabase.auth.signOut();
          setView("landing");
        }} />
      )}
    </main>
  );
}
