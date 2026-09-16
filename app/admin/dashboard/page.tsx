import Link from "next/link";
import Image from "next/image";
import { listTechnicians } from "@/lib/convexServer";
import { logout } from "./actions";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

export default async function AdminDashboardPage() {
  const technicians = await listTechnicians();

  return (
    <div className="container-page py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Admin</p>
          <h1 className="text-2xl font-bold text-navy">Technician applications</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/messages" className="btn-secondary">Messages</Link>
          <form action={logout}>
            <button type="submit" className="btn-secondary">Sign out</button>
          </form>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy/5 text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {technicians.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink/50">
                  No applications yet.
                </td>
              </tr>
            )}
            {technicians.map((t) => (
              <tr key={t._id} className="border-t border-black/5 hover:bg-navy/[0.02]">
                <td className="px-4 py-3">
                  {t.photoUrl ? (
                    <Image
                      src={t.photoUrl}
                      alt={t.fullName}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-navy/10" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/dashboard/${t._id}`} className="font-medium text-navy hover:underline">
                    {t.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize text-ink/70">{t.serviceCategory}</td>
                <td className="px-4 py-3 text-ink/70">{t.area}</td>
                <td className="px-4 py-3 text-ink/70">
                  {new Date(t.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[t.status]}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
