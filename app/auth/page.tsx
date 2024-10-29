"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase";

export default function AuthPage() {
  const supabase = createClient();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#4F46E5",
                  brandAccent: "#4338CA",
                },
              },
            },
          }}
          providers={["google"]}
          redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`}
          onlyThirdPartyProviders // Only show Google sign-in
        />
      </div>
    </div>
  );
}
