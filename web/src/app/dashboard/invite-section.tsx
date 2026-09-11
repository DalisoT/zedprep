"use client";

import { useState } from "react";
import { UserPlus, Loader2, Copy, Check } from "lucide-react";

type Invite = {
  id: string;
  token: string;
  email: string;
  full_name: string | null;
  expires_at: string;
};

export function InviteTeacherSection() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestInvite, setLatestInvite] = useState<Invite | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, full_name: fullName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send invite");
        return;
      }

      setLatestInvite(data.invite);
      setEmail("");
      setFullName("");
    } catch (err) {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  const inviteUrl = latestInvite
    ? `${window.location.origin}/invite/${latestInvite.token}`
    : null;

  async function copyLink() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-brand-700" />
        <h2 className="text-lg font-semibold text-gray-900">Invite a teacher</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Teacher's name (optional)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teacher@school.co.zm"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !email}
          className="bg-brand-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-brand-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Generating link..." : "Generate invite link"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-3">
          {error}
        </div>
      )}

      {latestInvite && inviteUrl && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
          <p className="text-sm font-medium text-brand-900 mb-2">
            Invite created for {latestInvite.email}
          </p>
          <p className="text-xs text-brand-800 mb-3">
            Send this link to your teacher via WhatsApp. It expires in 14 days.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border border-brand-200 rounded px-3 py-2 text-xs font-mono text-gray-800 truncate">
              {inviteUrl}
            </code>
            <button
              type="button"
              onClick={copyLink}
              className="bg-brand-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
