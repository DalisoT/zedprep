import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { StudentSignupForm } from "./signup-form";

export default async function StudentSignupPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/student");
  }

  let school = null;
  let codeError = null;

  if (searchParams.code) {
    const { data } = await supabase
      .from("schools")
      .select("id, name, district")
      .eq("slug", searchParams.code.toLowerCase())
      .maybeSingle();

    if (data) {
      school = data;
    } else {
      codeError = `We couldn't find a school with code "${searchParams.code}". Double-check with your teacher.`;
    }
  }

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
                Student signup
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {school ? `Join ${school.name}` : "Join your school"}
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Ask your teacher for your school&apos;s code, then enter it below
              to create your student account.
            </p>

            {!school && (
              <div className="mb-4">
                <form
                  method="get"
                  className="flex gap-2"
                  action="/student/signup"
                >
                  <input
                    type="text"
                    name="code"
                    defaultValue={searchParams.code ?? ""}
                    placeholder="e.g. zedprep-ae6e"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                  >
                    Look up
                  </button>
                </form>
                {codeError && (
                  <p className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
                    {codeError}
                  </p>
                )}
              </div>
            )}

            {school && (
              <StudentSignupForm
                schoolId={school.id}
                schoolName={school.name}
                code={searchParams.code!}
              />
            )}
          </div>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-700 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
