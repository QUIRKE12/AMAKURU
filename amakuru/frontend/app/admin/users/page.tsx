import { Users } from "lucide-react";

export default function UsersRolesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Users &amp; Roles</h1>
        <p className="mt-1 text-sm text-muted">Manage team members and access control.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-line bg-white px-6 py-16 text-center">
        <Users size={28} className="mb-3 text-muted" />
        <h2 className="text-sm font-bold text-ink">Coming soon</h2>
        <p className="mt-1.5 max-w-sm text-sm text-muted">
          The backend doesn&apos;t have a user-listing or role-management API yet (only auth/sync). Add a
          `GET /api/users` + `PATCH /api/users/:id` route pair, and this page can list the team and let Admins
          change roles, matching the layout you shared.
        </p>
      </div>
    </div>
  );
}
