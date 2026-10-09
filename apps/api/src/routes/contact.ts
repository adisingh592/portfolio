import { Router } from "express";
import { contactSchema } from "@portfolio/shared";
import { sendContactMessage } from "../services/mail.service";

export const contactRouter = Router();

contactRouter.post("/", async (req, res) => {
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid input", issues: result.error.issues });
    return;
  }
  await sendContactMessage(result.data);
  res.status(202).json({ ok: true });
});
