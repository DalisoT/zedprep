import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogOut, Users, BookOpen, BarChart3, Settings } from "lucide-react";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get the user's profile (includes school_id, role, full_name)
  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, role, school_id, schools(id, name, district, plan, status)")
    .eq("id", user.id)
    .single();

  // If no profile or no school, force onboarding
  if (!profile?.school_id) {
    redirect("/onboarding");
  }

  const school = Array.isArray(profile.schools)
    ? profile.schools[0]
    : profile.schools;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
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
        {/* Welcome banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
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
            <div className="text-right text-sm text-gray-500">
              {user.email}
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="bg-accent-50 border border-accent-200 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">
            Your school is live 🎉
          </h2>
          <p className="text-sm text-gray-700 mb-3">
            Step 2 (auth + database foundation) is done. The next steps, in
            order, will:
          </p>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>
              <strong>Step 3</strong> — Build the teacher upload tool so your
              teachers can start adding questions
            </li>
            <li>
              <strong>Step 4</strong> — Build the student PWA so they can
              practice on their phones
            </li>
            <li>
              <strong>Step 5</strong> — Add simulated exams (timed, randomised
              questions)
            </li>
            <li>
              <strong>Step 6</strong> — Wire up MTN MoMo so you can pay / be
              paid
            </li>
            <li>
              <strong>Step 7</strong> — WhatsApp parent digest
            </li>
          </ol>
        </div>

        {/* Placeholder feature grid — not functional yet */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, title: "Students", desc: "Invite + manage", count: 0 },
            {
              icon: BookOpen,
              title: "Questions",
              desc: "In your school's bank",
              count: 0,
            },
            {
              icon: BarChart3,
              title: "Practice",
              desc: "Attempts this week",
              count: 0,
            },
            {
              icon: Settings,
              title: "Settings",
              desc: "Plan, billing, team",
              count: null,
            },
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
                <div>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-8 text-center">
          Step 2 of the 12-week build plan is complete. The numbers above will
          start populating as we add features.
        </p>
      </main>
    </div>
  );
}
