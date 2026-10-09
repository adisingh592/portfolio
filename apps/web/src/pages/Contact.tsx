import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Check, Copy, FileText, LoaderCircle, Mail, Send } from "lucide-react";
import { siGithub } from "simple-icons";
import { contactSchema, ROUTES, type ContactInput } from "@portfolio/shared";
import { cn } from "@portfolio/ui";
import { profile, socials } from "@/data/profile";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { contactEnabled, ContactNotConfiguredError, mailtoFor, submitContact } from "@/lib/contact";
import { DUR, EASE, stagger } from "@/lib/motion";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Button, ButtonAnchor } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TechIcon } from "@/components/ui/TechIcon";
import { useToast } from "@/components/ui/Toast";

type Field = keyof ContactInput;
type Errors = Partial<Record<Field, string>>;
const empty: ContactInput = { name: "", email: "", message: "" };

function validate(values: ContactInput): Errors {
  const result = contactSchema.safeParse(values);
  if (result.success) return {};
  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as Field;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the address is still visible and selectable */
    }
  };
  return (
    <button type="button" onClick={copy} aria-label={copied ? "Email copied" : "Copy email address"} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-2 transition-colors hover:border-fg/40 hover:text-fg">
      {copied ? <Check aria-hidden className="h-4 w-4 text-olive" /> : <Copy aria-hidden className="h-4 w-4" />}
    </button>
  );
}

function Input({
  id, label, value, error, onChange, onBlur, type = "text", multiline = false, autoComplete,
}: {
  id: Field; label: string; value: string; error?: string; onChange: (v: string) => void; onBlur: () => void;
  type?: string; multiline?: boolean; autoComplete?: string;
}) {
  const describedBy = error ? `${id}-error` : undefined;
  const cls = cn(
    "peer w-full border-b bg-transparent py-3 text-lg outline-none transition-colors duration-300 placeholder:text-fg-2/50",
    error ? "border-danger" : "border-fg/25 hover:border-fg/50 focus:border-fg",
  );
  return (
    <div className="relative">
      <label htmlFor={id} className="label">{label}</label>
      {multiline ? (
        <textarea id={id} name={id} rows={5} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} aria-invalid={!!error} aria-describedby={describedBy} className={cn(cls, "resize-none")} placeholder="Tell me about your idea…" />
      ) : (
        <input id={id} name={id} type={type} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} aria-invalid={!!error} aria-describedby={describedBy} autoComplete={autoComplete} className={cls} />
      )}
      {/* P03: accent underline grows from the left on focus */}
      <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-house peer-focus:scale-x-100" />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="mt-2 text-sm text-danger"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.instant }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  useDocumentTitle("Contact");
  const toast = useToast();
  const [values, setValues] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [fallback, setFallback] = useState<string | null>(null);

  const set = (field: Field) => (v: string) => {
    const next = { ...values, [field]: v };
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    const input = contactSchema.parse(values);
    setStatus("sending");
    try {
      await submitContact(input);
      setStatus("sent");
      setValues(empty);
      setTouched(false);
      toast({ tone: "success", title: "Message sent", body: "Thanks! I'll reply to you by email." });
    } catch (err) {
      setStatus("idle");
      if (err instanceof ContactNotConfiguredError) {
        setFallback(mailtoFor(profile.email, input));
        toast({ tone: "info", title: "Not sent yet", body: "The form isn't connected to email yet. Use the button below to send it from your email app." });
      } else {
        toast({ tone: "error", title: "Couldn't send your message", body: `Please try again, or email me at ${profile.email}.` });
      }
    }
  };

  const channels = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: <Mail aria-hidden className="h-4 w-4" />, extra: <CopyEmail /> },
    socials.github && { label: "GitHub", value: socials.github.replace("https://", ""), href: socials.github, icon: <TechIcon icon={siGithub} className="h-4 w-4" />, external: true },
    socials.linkedin && { label: "LinkedIn", value: socials.linkedin.replace("https://www.", ""), href: socials.linkedin, icon: <span aria-hidden className="text-[11px] font-semibold">in</span>, external: true },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: React.ReactNode; extra?: React.ReactNode; external?: boolean }[];

  return (
    <div className="gutter grid grid-cols-12 gap-x-4 gap-y-16 pb-12 pt-32 md:pt-40">
      <div className="col-span-12 lg:col-span-6">
        <Reveal trigger="mount">
          <SectionLabel index="01">Contact</SectionLabel>
        </Reveal>
        <LineReveal
          as="h1"
          trigger="mount"
          lines={["Let's build", "something", <em key="t" className="text-accent">together.</em>]}
          className="mt-6 font-display text-[clamp(3.25rem,8vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
        />
        <Reveal trigger="mount" delay={0.4}>
          <p className="mt-8 max-w-md text-lg text-fg-2">I'm open to collaborations, freelance work, internships and interesting opportunities.</p>
        </Reveal>

        <ul className="mt-10 divide-y divide-line border-y border-line">
          {channels.map((c, i) => (
            <Reveal as="li" trigger="mount" key={c.label} delay={0.5 + stagger.row(i)} className="flex items-center gap-4 py-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt text-accent">{c.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="label">{c.label}</p>
                <a href={c.href} {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})} className="mt-1 block truncate transition-colors hover:text-accent">{c.value}</a>
              </div>
              {c.extra}
            </Reveal>
          ))}
          <Reveal as="li" trigger="mount" delay={0.5 + stagger.row(channels.length)} className="flex items-center gap-4 py-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-alt text-accent"><FileText aria-hidden className="h-4 w-4" /></span>
            <div className="flex-1">
              <p className="label">Resume</p>
              <Link to={ROUTES.resume} className="mt-1 block transition-colors hover:text-accent">View my resume</Link>
            </div>
          </Reveal>
        </ul>
      </div>

      <Reveal trigger="mount" delay={0.35} className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-16">
        <form noValidate onSubmit={onSubmit} className="space-y-8 rounded-[6px] border border-line bg-surface p-6 md:p-10" aria-describedby={contactEnabled ? undefined : "form-note"}>
          <Input id="name" label="Your name" value={values.name} error={errors.name} onChange={set("name")} onBlur={() => touched && setErrors(validate(values))} autoComplete="name" />
          <Input id="email" label="Your email" type="email" value={values.email} error={errors.email} onChange={set("email")} onBlur={() => touched && setErrors(validate(values))} autoComplete="email" />
          <Input id="message" label="Your message" multiline value={values.message} error={errors.message} onChange={set("message")} onBlur={() => touched && setErrors(validate(values))} />

          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              disabled={status === "sending"}
              icon={status === "sending" ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : <Send aria-hidden className="h-4 w-4" />}
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </Button>
            <AnimatePresence>
              {status === "sent" && (
                <motion.p className="flex items-center gap-2 text-sm text-olive" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: DUR.quick, ease: EASE }}>
                  <Check aria-hidden className="h-4 w-4" /> Sent. Thank you!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {!contactEnabled && (
            <p id="form-note" className="text-sm text-fg-2">
              This form isn't connected to email yet, so it can't deliver messages on its own. Write to me at{" "}
              <a href={`mailto:${profile.email}`} className="text-fg underline underline-offset-4">{profile.email}</a>.
            </p>
          )}

          <AnimatePresence>
            {fallback && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: DUR.quick, ease: EASE }} className="rounded-[6px] border border-accent/30 bg-bg p-4">
                <p className="text-sm">Your message is ready. Open it in your email app to send it:</p>
                <ButtonAnchor href={fallback} className="mt-3" icon={<Mail aria-hidden className="h-4 w-4" />}>Open in email app</ButtonAnchor>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Reveal>
    </div>
  );
}
