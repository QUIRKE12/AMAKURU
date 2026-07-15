// NEW — Phase 4
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import BookmarkButton from "@/components/BookmarkButton";

type BookmarkedArticle = {
  _id: string;
  article: { _id: string; title: string; slug: string; coverImageUrl?: string; excerpt?: string };
};

export default function BookmarksPage() {
  const { profile: user, authedFetch } = useAuthUser();
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      const res = await authedFetch("/api/bookmarks");
      const data = await res.json();
      setBookmarks(data.bookmarks ?? data);
      setLoading(false);
    })();
  }, [user, authedFetch]);

  if (!user) {
    return <p className="mx-auto max-w-2xl px-4 py-12 text-slate-600">Sign in to see the articles you've saved.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-900">Saved Articles</h1>

      {loading && <p className="mt-6 text-sm text-slate-400">Loading…</p>}

      {!loading && bookmarks.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          Nothing saved yet. Tap "Save" on any article to find it here later.
        </p>
      )}

      <div className="mt-6 divide-y divide-slate-100">
        {bookmarks.map((b) => (
          <div key={b._id} className="flex items-center justify-between py-4">
            <Link href={`/articles/${b.article.slug}`} className="text-slate-900 hover:underline">
              {b.article.title}
            </Link>
            <BookmarkButton articleId={b.article._id} initialBookmarked />
          </div>
        ))}
      </div>
    </div>
  );
}
