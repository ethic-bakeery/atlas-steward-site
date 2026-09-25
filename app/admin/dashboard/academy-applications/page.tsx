import Link from "next/link";
import { listAcademyApplications } from "@/lib/convexServer";

type AcademyApplication = {
  _id: string;
  fullName: string;
  age: number;
  tradePreference: "electrical" | "plumbing" | "cleaning";
  location: string;
  submittedAt: number;
  status: "pending" | "approved" | "rejected";
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

const tradeLabels: Record<string, string> = {
  electrical: "Electrical",
  plumbing: "Plumbing",
  cleaning: "Cleaning",
};

export default async function AcademyApplicationsPage() {
  const applications: AcademyApplication[] =
    await listAcademyApplications();

  return (
    <div className="container-page py-12">
      <Link
        href="/admin/dashboard"
        className="text-sm text-navy hover:underline"
      >
        ← Back to technician applications
      </Link>

      <div className="mt-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Admin
        </p>

        <h1 className="text-2xl font-bold text-navy">
          Academy applications
        </h1>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy/5 text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Trade</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-ink/50"
                >
                  No applications yet.
                </td>
              </tr>
            )}

            {applications.map((a) => (
              <tr
                key={a._id}
                className="border-t border-black/5 hover:bg-navy/[0.02]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/dashboard/academy-applications/${a._id}`}
                    className="font-medium text-navy hover:underline"
                  >
                    {a.fullName}
                  </Link>
                </td>

                <td className="px-4 py-3 text-ink/70">
                  {a.age}
                </td>

                <td className="px-4 py-3 text-ink/70">
                  {tradeLabels[a.tradePreference]}
                </td>

                <td className="px-4 py-3 text-ink/70">
                  {a.location}
                </td>

                <td className="px-4 py-3 text-ink/70">
                  {new Date(a.submittedAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      statusStyles[a.status]
                    }`}
                  >
                    {a.status}
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
