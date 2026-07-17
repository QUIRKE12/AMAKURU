"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import {
  LayoutDashboard,
  LineChart,
  Newspaper,
  Tags,
  Image as ImageIcon,
  MessagesSquare,
  Bell,
  Mail,
  Megaphone,
  Users,
  ScrollText,
  Settings as SettingsIcon,
  Menu,
  LogOut,
} from "lucide-react";

const STAFF_ROLES = ["Admin", "Editor", "Author", "Moderator"];
const ADMIN_ONLY = ["Admin"];

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Roles allowed to see this item; omit for "any staff role". */
  roles?: string[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/articles", label: "Articles", icon: Newspaper },
      { href: "/admin/categories", label: "Categories & Tags", icon: Tags },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon },
      { href: "/admin/moderation", label: "Comments", icon: MessagesSquare },
    ],
  },
  {
    label: "Engagement",
    items: [
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/newsletter", label: "Newsletters", icon: Mail },
      { href: "/admin/ads", label: "Advertisements", icon: Megaphone },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/users", label: "Users & Roles", icon: Users, roles: ADMIN_ONLY },
      { href: "/admin/audit-log", label: "Audit Log", icon: ScrollText, roles: ADMIN_ONLY },
      { href: "/admin/settings", label: "Settings", icon: SettingsIcon, roles: ADMIN_ONLY },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, firebaseUser } = useAuthUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading…
      </div>
    );
  }

  if (!firebaseUser || !profile) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Sign in required</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in from the homepage first, then come back to the admin dashboard.
        </p>
        <Link href="/" className="mt-4 inline-block rounded bg-teal px-4 py-2 text-sm font-semibold text-white">
          Go to homepage
        </Link>
      </div>
    );
  }

  if (!STAFF_ROLES.includes(profile.role)) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Not authorized</h1>
        <p className="mt-2 text-sm text-muted">
          Your account role (<strong>{profile.role}</strong>) doesn&apos;t have access to the
          admin dashboard. Ask an Admin to change your role.
        </p>
      </div>
    );
  }

  const initials = (profile.name || profile.email || "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-papyrus/40">
      {/* Mobile backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col bg-[#16213E] transition-transform duration-200 lg:sticky lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber text-sm font-black text-[#16213E]">
              A
            </div>
            <div className="text-[15px] font-bold tracking-wide text-white">Amakuru</div>
          </div>
          <div className="mt-1 pl-[46px] text-[10px] uppercase tracking-wider text-white/50">
            Admin dashboard
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map((section) => {
            const visibleItems = section.items.filter(
              (item) => !item.roles || item.roles.includes(profile.role)
            );
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.label} className="mb-1">
                <div className="mb-2 mt-4 px-2 text-[10px] font-bold uppercase tracking-widest text-white/40 first:mt-0">
                  {section.label}
                </div>
                <div className="flex flex-col gap-1">
                  {visibleItems.map((item) => {
                    const active =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname?.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 rounded-lg border-l-[3px] px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                          active
                            ? "border-teal bg-teal/15 text-teal"
                            : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon size={17} strokeWidth={2} className="shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => signOut(auth)}
            title="Click to logout"
            className="flex w-full items-center gap-2.5 rounded-xl bg-amber/15 px-3 py-2.5 text-left transition-colors hover:bg-amber/25"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber text-[13px] font-extrabold text-[#16213E]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-white">{profile.name}</div>
              <div className="text-[10px] text-white/50">Click to logout</div>
            </div>
            <LogOut size={14} className="shrink-0 text-white/50" />
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink"
          >
            <Menu size={20} />
          </button>
          <div className="font-display text-base font-semibold text-ink">Amakuru Admin</div>
        </div>
        <main className="min-w-0 flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
