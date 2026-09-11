"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, School, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth + redirect if already onboarded
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email ?? null);

      // If user already has a school, skip onboarding
      const { data: profile } = await supabase
        .from("users")
        .select("school_id")
        .eq("id", user.id)
        .single();

      if (profile?.school_id) {
        router.push("/dashboard");
        return;
      }

      setChecking(false);
    }
    checkAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.rpc("create_school_for_admin", {
      p_school_name: schoolName.trim(),
      p_district: district.trim() || null,
      p_location: location.trim() || null,
      p_contact_name: contactName.trim() || null,
      p_contact_phone: contactPhone.trim() || null,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brand-700" />
      </div>
    );
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
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <School className="w-5 h-5 text-brand-700" />
              <span className="text-sm font-medium text-brand-700">
                Step 2 of 2 — school setup
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tell us about your school
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              You&apos;re signed in as <strong>{userEmail}</strong>. Just a few
              more details and your school will be live on ZedPrep.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="schoolName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  School name <span className="text-red-500">*</span>
                </label>
                <input
                  id="schoolName"
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="e.g. Lusaka Secondary School"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    District
                  </label>
                  <input
                    id="district"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g. Lusaka"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Area / Township
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="e.g. Kabulonga"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contactName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your name
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Head teacher / admin"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="0977 123 456"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-brand-900">
                  You&apos;ll start on a <strong>free 4-month trial</strong>.
                  After the trial, you can subscribe at K1,500/term (or stay on
                  the free tier with limited features).
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !schoolName.trim()}
                className="w-full bg-brand-700 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Setting up your school..." : "Finish setup"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
