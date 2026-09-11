"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export function StudentSignupForm({
  schoolId,
  schoolName,
  code,
}: {
  schoolId: string;
  schoolName: string;
  code: string;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("Form 3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const GRADES = ["Grade 6", "Form 1", "Form 2", "Form 3", "Form 4", "Form 5"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, grade },
        emailRedirectTo: `${window.location.origin}/student`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // After signup, link the user to the school as a student.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("users").upsert({
        id: user.id,
        full_name: fullName,
        email,
        role: "student",
        school_id: schoolId,
        grade,
      });
    }

    // If email confirmation is OFF, the session is set immediately.
    // Hard-navigate to the student dashboard.
    if (data?.session) {
      window.location.href = "/student";
      return;
    }

    // Email confirmation is ON — user must click the email link first.
    setMessage(
      `Check your email to confirm your account. After confirming, you'll be redirected to ${schoolName}'s student portal.`
    );
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your name
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="e.g. Chipo Banda"
        />
      </div>

      <div>
        <label
          htmlFor="grade"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Grade
        </label>
        <select
          id="grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          required
        >
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          autoComplete="email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="8+ characters"
          autoComplete="new-password"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-brand-50 border border-brand-200 text-brand-800 text-sm rounded-lg p-3">
          {message}
        </div>
      )}

      <input type="hidden" name="code" value={code} />

      <button
        type="submit"
        disabled={loading || !fullName.trim() || !password}
        className="w-full bg-brand-700 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Creating account..." : `Join ${schoolName}`}
      </button>
    </form>
  );
}
