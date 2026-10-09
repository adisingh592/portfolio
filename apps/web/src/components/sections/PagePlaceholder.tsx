// Temporary page body used until each page is built (phases 3–5).
export function PagePlaceholder({ label, title }: { label: string; title: string }) {
  return (
    <section className="px-4 py-24 sm:px-6 md:px-10 md:py-36">
      <p className="font-mono text-sm text-fg/50">{label}</p>
      <h1 className="mt-4 font-display text-[15vw] font-semibold leading-[0.85] tracking-[-0.06em] md:text-[8vw]">
        {title}
      </h1>
    </section>
  );
}
