import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { getTechnician } from "@/lib/convexServer";
import { setStatus } from "../actions";

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{label}</p>
      <p className="mt-0.5 text-sm text-ink">{value}</p>
    </div>
  );
}

export default async function TechnicianDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const technician = await getTechnician(params.id as Id<"technicians">);
  if (!technician) notFound();

  const approve = async () => {
    "use server";
    await setStatus(technician._id, "approved");
  };
  const reject = async () => {
    "use server";
    await setStatus(technician._id, "rejected");
  };
  const resetToPending = async () => {
    "use server";
    await setStatus(technician._id, "pending");
  };

  return (
    <div className="container-page py-12">
      <Link href="/admin/dashboard" className="text-sm text-navy hover:underline">
        ← Back to all applications
      </Link>

      <div className="mt-4 grid gap-8 sm:grid-cols-[200px_1fr]">
        <div>
          {technician.photoUrl ? (
            <Image
              src={technician.photoUrl}
              alt={technician.fullName}
              width={200}
              height={200}
              className="aspect-square w-full rounded-lg object-cover"
            />
          ) : (
            <div className="aspect-square w-full rounded-lg bg-navy/10" />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-navy">{technician.fullName}</h1>
          <p className="mt-1 capitalize text-ink/60">{technician.serviceCategory} technician</p>

          <div className="mt-6 grid grid-cols-2 gap-5 rounded-lg border border-black/10 bg-white p-5 sm:grid-cols-3">
            <Field label="Email" value={technician.email} />
            <Field label="Phone" value={technician.phone} />
            <Field label="Date of birth" value={technician.dateOfBirth} />
            <Field label="Area" value={technician.area} />
            <Field label="Address" value={technician.address} />
            <Field label="Years of experience" value={technician.yearsExperience} />
            <Field label="Reference name" value={technician.referenceName} />
            <Field label="Reference phone" value={technician.referencePhone} />
            <Field
              label="Submitted"
              value={new Date(technician.submittedAt).toLocaleString()}
            />
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Work experience described
            </p>
            <p className="mt-1 whitespace-pre-wrap rounded-lg border border-black/10 bg-white p-4 text-sm text-ink/80">
              {technician.priorWorkDescription}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-ink/60">
              Current status: <span className="font-semibold capitalize">{technician.status}</span>
            </span>
            <form action={approve}>
              <button type="submit" className="btn-primary bg-emerald-700 hover:bg-emerald-800">
                Approve
              </button>
            </form>
            <form action={reject}>
              <button type="submit" className="btn-primary bg-red-700 hover:bg-red-800">
                Reject
              </button>
            </form>
            {technician.status !== "pending" && (
              <form action={resetToPending}>
                <button type="submit" className="btn-secondary">Reset to pending</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
