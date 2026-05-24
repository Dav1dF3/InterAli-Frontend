import type { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,_var(--background)_92%,_var(--primary)))] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center py-6">{children}</div>
    </div>
  );
}