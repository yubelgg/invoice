import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.log("Session error:", sessionError);
      return NextResponse.redirect(new URL("/auth/error", request.url));
    }

    // verified users exist in users table
    const { data: user, error: userError } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", session?.user.id)
      .single();

    if (!user) {
      // create new user
      const { data: newClient, error: createError } = await supabase
        .from("clients")
        .insert([
          {
            user_id: session?.user.id,
            email: session?.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      console.log("Insert result:", { newClient, createError });

      if (createError) {
        console.error("Error creating user:", createError);
        return NextResponse.redirect(new URL("/auth/error", request.url));
      }
    }

    return NextResponse.redirect(new URL("/invoices/create", request.url));
  }
  return NextResponse.redirect(new URL("/auth/error", request.url));
}
