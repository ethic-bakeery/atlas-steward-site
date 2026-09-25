"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import {
  updateTechnicianStatus,
  markContactMessageRead,
  updateAcademyApplicationStatus,
} from "@/lib/convexServer";
import { SESSION_COOKIE_NAME } from "@/lib/session";

export async function setStatus(
  id: Id<"technicians">,
  status: "pending" | "approved" | "rejected"
) {
  await updateTechnicianStatus(id, status);
  revalidatePath("/admin/dashboard");
  revalidatePath(`/admin/dashboard/${id}`);
}

export async function markMessageRead(id: Id<"contactMessages">) {
  await markContactMessageRead(id);
  revalidatePath("/admin/dashboard/messages");
}

export async function logout() {
  cookies().set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  redirect("/admin/login");
}

export async function setAcademyApplicationStatus(
  id: Id<"academyApplications">,
  status: "pending" | "approved" | "rejected"
) {
  await updateAcademyApplicationStatus(id, status);
  revalidatePath("/admin/dashboard/academy-applications");
  revalidatePath(`/admin/dashboard/academy-applications/${id}`);
}
