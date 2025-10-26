"use client"

import { createClient } from "../utils/client";

export default function SignOutButton() {
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    // Full reload to ensure server-rendered components pick up updated cookies
    window.location.href = "/";
  }

  return <button onClick={handleSignOut}>Sign Out</button>;
}
