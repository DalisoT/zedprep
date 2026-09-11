import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { AcceptInviteForm } from "./accept-form";

type PageProps = {
  params: { token: string };
};

export default async function InvitePage({ params }: PageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Look up the invite
  const { data: invite } = await supabase
    .from("teacher_invites")
    .select("id, email, full_name, expires_at, accepted_at, schools(name, district)")
    .eq("token", params.token)
    .maybeSingle();

  // No such invite
  if (!invite) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invite not found
          </h1>
          <p className="text-gray-600">
            This invite link is invalid. Ask your school admin to send you a
            new one.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 text-brand-700 font-medium hover:underline"
          >
            Go home
          </Link>
        </div>
      </div>
    );
  }

  // Already accepted
  if (invite.accepted_at) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invite already used
          </h1>
          <p className="text-gray-600">
            This invite link has already been used. If that wasn&apos;t you,
            ask your school admin to send a new one.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 text-brand-700 font-medium hover:underline"
          >
            Log in instead
          </Link>
        </div>
      </div>
    );
  }

  // Expired
  if (new Date(invite.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invite expired
          </h1>
          <p className="text-gray-600">
            This invite link has expired. Ask your school admin to send you a
            fresh one.
          </p>
        </div>
      </div>
    );
  }

  // If already logged in, handle the invite
  if (user) {
    // Get the user's current school + role
    const { data: existingProfile } = await supabase
      .from("users")
      .select("school_id, role")
      .eq("id", user.id)
      .maybeSingle();

    const school = Array.isArray(invite.schools)
      ? invite.schools[0]
      : invite.schools;

    if (existingProfile?.school_id === school?.id) {
      // Already a member of this school
      redirect(
        existingProfile.role === "school_admin" ? "/dashboard" : "/teacher"
      );
    }

    if (existingProfile?.school_id && existingProfile.school_id !== school?.id) {
      // Logged-in user is already in a different school
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              You&apos;re already a member of another school
            </h1>
            <p className="text-gray-600">
              Log out first, then click the invite link to join{" "}
              {school?.name}.
            </p>
          </div>
        </div>
      );
    }

    // No school yet — accept the invite and link the user as a teacher.
    // Use upsert (not update) because for newly-signed-up users the
    // public.users row may not exist yet.
    const { error: acceptError } = await supabase.rpc("accept_teacher_invite", {
      p_token: params.token,
    });

    if (!acceptError) {
      await supabase
        .from("users")
        .upsert(
          {
            id: user.id,
            full_name:
              user.user_metadata?.full_name ?? user.email ?? "Teacher",
            role: "teacher",
            school_id: school?.id,
            is_active: true,
          },
          { onConflict: "id" }
        );

      redirect("/teacher");
    }
  }

  const school = Array.isArray(invite.schools)
    ? invite.schools[0]
    : invite.schools;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-bold text-lg text-gray-900">ZedPrep</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-brand-700" />
              <span className="text-sm font-medium text-brand-700">
                Teacher invite
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Join {school?.name ?? "your school"} on ZedPrep
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              You&apos;ve been invited as a teacher
              {invite.full_name ? ` (${invite.full_name})` : ""}. Create your
              account below to start adding questions.
            </p>

            <AcceptInviteForm
              token={params.token}
              defaultEmail={invite.email}
              defaultFullName={invite.full_name ?? ""}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
