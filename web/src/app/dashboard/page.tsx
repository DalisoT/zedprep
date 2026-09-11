import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Users, BookOpen, BarChart3, Settings, UserPlus, ClipboardCheck } from "lucide-react";
import { LogoutButton } from "./logout-button";
import { InviteTeacherSection } from "./invite-section";
import { ModerationQueueSection } from "./moderation-section";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, full_name, role, school_id, schools(id, name, district, plan, status)")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    console.warn(
      `[dashboard] No profile row for user ${user.id} (${user.email}). ProfileError:`,
      profileError
    );
    redirect("/onboarding");
  }

  if (!profile.school_id) {
    console.warn(
      `[dashboard] Profile for ${user.email} has no school_id. Sending to onboarding.`
    );
    redirect("/onboarding");
  }

  const school = Array.isArray(profile.schools)
    ? profile.schools[0]
    : profile.schools;

  // Counts for the dashboard
  const [
    { count: teacherCount },
    { count: pendingCount },
    { count: approvedCount },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("school_id", profile.school_id)
      .in("role", ["teacher", "school_admin"]),
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("school_id", profile.school_id)
      .eq("status", "pending"),
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("school_id", profile.school_id)
      .eq("status", "approved"),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-bold text-lg text-gray-900">ZedPrep</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {profile.full_name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome, {profile.full_name}
          </h1>
          <p className="text-gray-600">
            <strong>{school?.name}</strong>
            {school?.district ? ` · ${school.district}` : ""} ·{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-800 capitalize">
              {school?.plan} plan
            </span>
          </p>
        </div>

        {/* Step indicator */}
        <div className="bg-accent-50 border border-accent-200 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">
            Step 3 is live 🎉
          </h2>
          <p className="text-sm text-gray-700">
            You can now invite teachers and review their submitted questions.
            Once you approve a few, students can start practising (Step 4).
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, title: "Teachers", count: teacherCount ?? 0 },
            { icon: ClipboardCheck, title: "Pending review", count: pendingCount ?? 0 },
            { icon: BookOpen, title: "Approved questions", count: approvedCount ?? 0 },
            { icon: Settings, title: "Settings", count: null },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <item.icon className="w-6 h-6 text-brand-700 mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {item.count === null ? "—" : item.count}
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium text-gray-900">{item.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Invite section */}
        <div className="mb-6">
          <InviteTeacherSection />
        </div>

        {/* Moderation queue */}
        <div className="mb-6">
          <ModerationQueueSection schoolId={profile.school_id} />
        </div>
      </main>
    </div>
  );
}
