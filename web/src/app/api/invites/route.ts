import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInviteToken } from "@/lib/invites";

export async function POST(request: Request) {
  const supabase = createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get the school_admin's school
  const { data: profile } = await supabase
    .from("users")
    .select("school_id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.school_id || profile.role !== "school_admin") {
    return NextResponse.json(
      { error: "Only school admins can send invites" },
      { status: 403 }
    );
  }

  // Parse body
  const body = await request.json();
  const email = (body.email ?? "").trim().toLowerCase();
  const fullName = (body.full_name ?? "").trim() || null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  // Generate token + insert invite
  const token = generateInviteToken();

  const { data: invite, error } = await supabase
    .from("teacher_invites")
    .insert({
      school_id: profile.school_id,
      email,
      full_name: fullName,
      token,
      invited_by: user.id,
    })
    .select("id, token, email, full_name, expires_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ invite });
}
