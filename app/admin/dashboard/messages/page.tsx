import Link from "next/link";
import { listContactMessages } from "@/lib/convexServer";
import { markMessageRead } from "../actions";

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();

  return (
    <div className="container-page py-12">
      <Link href="/admin/dashboard" className="text-sm text-navy hover:underline">
        ← Back to applications
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Contact messages</h1>
      </div>

      <div className="mt-8 space-y-4">
        {messages.length === 0 && (
          <p className="rounded-lg border border-black/10 bg-white px-4 py-10 text-center text-ink/50">
            No messages yet.
          </p>
        )}

        {messages.map((m) => {
          const markRead = async () => {
            "use server";
            await markMessageRead(m._id);
          };

          return (
            <div key={m._id} className="rounded-lg border border-black/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-navy">{m.name}</p>
                  <p className="text-sm text-ink/60">{m.contactInfo}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      m.read ? "bg-black/5 text-ink/50" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {m.read ? "Read" : "New"}
                  </span>
                  {!m.read && (
                    <form action={markRead}>
                      <button type="submit" className="btn-secondary text-xs">
                        Mark as read
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/80">{m.message}</p>
              <p className="mt-3 text-xs text-ink/40">
                {new Date(m.submittedAt).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
