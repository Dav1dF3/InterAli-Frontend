import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Separator />
        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>InterAli conecta donantes y receivers para reducir desperdicio y facilitar entrega.</p>
          <div className="flex flex-wrap gap-4">
            <Link className="transition-colors hover:text-foreground" href="/food-listings">
              Explorar comidas
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/dashboard">
              Panel privado
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}