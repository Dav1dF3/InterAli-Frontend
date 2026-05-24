import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { FoodListing } from "@/lib/types";

function formatDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getListingStatusVariant(status: FoodListing["status"]) {
  if (status === "claimed") {
    return "warning";
  }

  if (status === "cancelled") {
    return "destructive";
  }

  return "success";
}

function getListingStatusLabel(status: FoodListing["status"]) {
  switch (status) {
    case "claimed":
      return "Reclamado";
    case "cancelled":
      return "Cancelado";
    default:
      return "Activo";
  }
}

type FoodListingCardProps = {
  listing: FoodListing;
  href?: string;
  actionLabel?: string;
};

export function FoodListingCard({ listing, href = `/food-listings/${listing.id}`, actionLabel = "Ver detalle" }: FoodListingCardProps) {
  return (
    <Card className="group h-full overflow-hidden border-border/80 bg-card/95 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl">
      <div className="h-1 bg-gradient-to-r from-primary/80 via-emerald-500/70 to-amber-400/70" />
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardDescription className="uppercase tracking-[0.18em] text-xs">{listing.category ?? "Categoría general"}</CardDescription>
            <CardTitle className="text-xl text-balance">{listing.title}</CardTitle>
          </div>
          <Badge variant={getListingStatusVariant(listing.status)} className="shrink-0">
            {getListingStatusLabel(listing.status)}
          </Badge>
        </div>
        {listing.description ? <p className="text-sm leading-6 text-muted-foreground">{listing.description}</p> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-muted/60 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Cantidad</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{listing.quantity}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/60 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Disponible hasta</p>
            <p className="mt-2 text-sm font-medium text-foreground">{formatDate(listing.expiration_date)}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Retiro</p>
          <p className="mt-2 text-sm text-foreground">{listing.pickup_address ?? "Se compartirá al confirmar"}</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 pt-5">
        <p className="text-xs text-muted-foreground">Publicado el {formatDate(listing.created_at)}</p>
        <Button asChild variant="outline" size="sm" className="rounded-full shadow-sm">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}