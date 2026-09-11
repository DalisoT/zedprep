"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ModerationActions({ questionId }: { questionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState("");

  async function decide(status: "approved" | "rejected") {
    setLoading(status === "approved" ? "approve" : "reject");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("questions")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        rejection_reason: status === "rejected" ? reason.trim() || null : null,
      })
      .eq("id", questionId);

    setLoading(null);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-2 mb-2">
          {error}
        </div>
      )}

      {showRejectForm && (
        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1">
            Why are you rejecting this? (shown to the teacher)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Mark scheme too vague, please specify..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      )}

      <div className="flex gap-2">
        {!showRejectForm ? (
          <>
            <button
              onClick={() => decide("approved")}
              disabled={loading !== null}
              className="bg-brand-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-800 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading === "approve" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Approve
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={loading !== null}
              className="border border-red-300 text-red-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => decide("rejected")}
              disabled={loading !== null || !reason.trim()}
              className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading === "reject" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              Confirm reject
            </button>
            <button
              onClick={() => {
                setShowRejectForm(false);
                setReason("");
              }}
              disabled={loading !== null}
              className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
