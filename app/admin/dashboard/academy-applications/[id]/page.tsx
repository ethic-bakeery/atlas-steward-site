import Link from "next/link";
import { notFound } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { getAcademyApplication } from "@/lib/convexServer";
import { setAcademyApplicationStatus } from "../../actions";

const tradeLabels: Record<string, string> = {
  electrical: "Electrical",
  plumbing: "Plumbing",
  cleaning: "Cleaning",
};

const educationLabels: Record<string, string> = {
  none: "No formal education",
  primary: "Primary school",
  secondary: "Secondary school (SSCE)",
  diploma_ond: "Diploma / OND",
  degree_hnd: "Degree / HND",
  other: "Other",
};

const experienceLabels: Record<string, string> = {
  none: "None",
  beginner: "Beginner",
  some: "Some experience",
  experienced: "Experienced",
};

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{label}</p>
      <p className="mt-0.5 text-sm text-ink">{value}</p>
    </div>
  );
}

export default async function AcademyApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const application = await getAcademyApplication(params.id as Id<"academyApplications">);
  if (!application) notFound();

  const approve = async () => {
    "use server";
    await setAcademyApplicationStatus(application._id, "approved");
  };
  const reject = async () => {
    "use server";
    await setAcademyApplicationStatus(application._id, "rejected");
  };
  const resetToPending = async () => {
    "use server";
    await setAcademyApplicationStatus(application._id, "pending");
  };

  return (
    <div className="container-page py-12">
      <Link href="/admin/dashboard/academy-applications" className="text-sm text-navy hover:underline">
        ← Back to all Academy applications
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-navy">{application.fullName}</h1>
      <p className="mt-1 text-ink/60">Interested in {tradeLabels[application.tradePreference]}</p>

      <div className="mt-6 grid grid-cols-2 gap-5 rounded-lg border border-black/10 bg-white p-5 sm:grid-cols-3">
        <Field label="Age" value={application.age} />
        <Field label="Phone" value={application.phone} />
        <Field label="Location in Yola" value={application.location} />
        <Field label="Emergency contact" value={application.emergencyContact} />
        <Field label="Education level" value={educationLabels[application.educationLevel]} />
        <Field label="Trade preference" value={tradeLabels[application.tradePreference]} />
        <Field label="Can attend consistently?" value={application.canAttendConsistently ? "Yes" : "No"} />
        <Field label="Has a conflicting commitment?" value={application.hasConflictingCommitment ? "Yes" : "No"} />
        <Field label="Experience level" value={experienceLabels[application.experienceLevel]} />
        <Field label="Submitted" value={new Date(application.submittedAt).toLocaleString()} />
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
          Why they want to learn this trade
        </p>
        <p className="mt-1 whitespace-pre-wrap rounded-lg border border-black/10 bg-white p-4 text-sm text-ink/80">
          {application.motivation}
        </p>
      </div>

      {application.hasConflictingCommitment && application.conflictingCommitmentExplanation && (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
            Conflicting commitment explained
          </p>
          <p className="mt-1 whitespace-pre-wrap rounded-lg border border-black/10 bg-white p-4 text-sm text-ink/80">
            {application.conflictingCommitmentExplanation}
          </p>
        </div>
      )}

      {application.experienceLevel !== "none" && application.experienceExplanation && (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
            Experience explained
          </p>
          <p className="mt-1 whitespace-pre-wrap rounded-lg border border-black/10 bg-white p-4 text-sm text-ink/80">
            {application.experienceExplanation}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-ink/60">
          Current status: <span className="font-semibold capitalize">{application.status}</span>
        </span>
        <form action={approve}>
          <button type="submit" className="btn-primary bg-emerald-700 hover:bg-emerald-800">Approve</button>
        </form>
        <form action={reject}>
          <button type="submit" className="btn-primary bg-red-700 hover:bg-red-800">Reject</button>
        </form>
        {application.status !== "pending" && (
          <form action={resetToPending}>
            <button type="submit" className="btn-secondary">Reset to pending</button>
          </form>
        )}
      </div>
    </div>
  );
}