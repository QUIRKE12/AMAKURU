"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<import("firebase/auth").User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setFirebaseUser(user));
    return () => unsubscribe();
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Amakuru</h1>
      <p className="mt-2 text-muted">
        Phase 1 scaffold — Next.js App Router + Firebase Auth + MongoDB, wired end-to-end.
      </p>

      <div className="mt-6">
        {firebaseUser ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">
              Signed in as <strong>{firebaseUser.email}</strong>
            </span>
            <button
              className="rounded border border-ink px-4 py-2 text-sm font-semibold"
              onClick={() => signOut(auth)}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            className="rounded bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            onClick={() => setAuthOpen(true)}
          >
            Sign in
          </button>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={() => {
          /* firebaseUser updates automatically via onAuthStateChanged */
        }}
      />
    </main>
  );
}
