import type { ContactInput } from "@portfolio/shared";

// Phase 5: send through Resend (or similar) using env.RESEND_API_KEY.
export async function sendContactMessage(input: ContactInput) {
  console.log("[contact]", input.name, `<${input.email}>`, input.message.slice(0, 80));
}
