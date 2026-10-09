// Contact form submission, kept separate so an email provider can be connected later
// without touching the form UI.
//
// To turn delivery on:
//   1. Implement apps/api/src/services/mail.service.ts (e.g. with Resend) so messages are emailed.
//   2. Set VITE_CONTACT_ENABLED=true in apps/web/.env.local.
// Until then the form validates, but never claims a message was sent.
import { API, type ContactInput } from "@portfolio/shared";
import { api } from "./api";

export const contactEnabled = import.meta.env.VITE_CONTACT_ENABLED === "true";

export class ContactNotConfiguredError extends Error {
  constructor() {
    super("Contact delivery is not configured");
  }
}

export async function submitContact(input: ContactInput) {
  if (!contactEnabled) throw new ContactNotConfiguredError();
  await api<{ ok: boolean }>(API.contact, { method: "POST", body: JSON.stringify(input) });
}

/** Prefilled email the visitor can send from their own mail app instead. */
export function mailtoFor(to: string, input: ContactInput) {
  const subject = encodeURIComponent(`Hello from ${input.name}`);
  const body = encodeURIComponent(`${input.message}\n\n${input.name}\n${input.email}`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
