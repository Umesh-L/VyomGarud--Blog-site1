interface TagPillProps {
  label: string;
  href?: string;
}

export function TagPill({ label, href }: TagPillProps) {
  const content = (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 shadow-sm shadow-black/40 transition hover:-translate-y-0.5 hover:border-white/30">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
      {label}
    </span>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
}
