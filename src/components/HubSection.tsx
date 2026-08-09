import type { ReactNode } from "react";

export function HubSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={title} className="rounded-xl border border-brand-100 bg-white p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-bold text-neutral-800">{title}</div>
          {description && <div className="text-xs text-neutral-500">{description}</div>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
