import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Separator />
        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>InterAli conecta personas que publican comida con quienes la necesitan, para reducir desperdicio y facilitar la entrega.</p>
          <div className="flex flex-wrap gap-4">
            <Link className="transition-colors hover:text-foreground" href="/food-listings">
              Ver publicaciones
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/dashboard">
              Área privada
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}