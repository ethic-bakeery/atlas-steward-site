import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// The admin secret lives only in the Next.js server environment (never sent
// to the browser) and is checked again inside the Convex functions
// themselves — so even someone who found the Convex deployment URL couldn't
// read technician data without this value.
function adminSecret(): string {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) {
    throw new Error("ADMIN_API_SECRET is not set in the Next.js environment.");
  }
  return secret;
}

export async function listTechnicians() {
  return fetchQuery(api.technicians.list, { adminSecret: adminSecret() });
}

export async function getTechnician(id: Id<"technicians">) {
  return fetchQuery(api.technicians.getById, { id, adminSecret: adminSecret() });
}

export async function updateTechnicianStatus(
  id: Id<"technicians">,
  status: "pending" | "approved" | "rejected"
) {
  return fetchMutation(api.technicians.updateStatus, {
    id,
    status,
    adminSecret: adminSecret(),
  });
}

export async function listContactMessages() {
  return fetchQuery(api.contact.list, { adminSecret: adminSecret() });
}

export async function markContactMessageRead(id: Id<"contactMessages">) {
  return fetchMutation(api.contact.markRead, { id, adminSecret: adminSecret() });
}
