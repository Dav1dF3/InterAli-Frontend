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
    <Card className="group h-full overflow-hidden border-border/80 bg-card/90 backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">{listing.title}</CardTitle>
            <CardDescription>{listing.category ?? "Categoría general"}</CardDescription>
          </div>
          <Badge variant={getListingStatusVariant(listing.status)}>{getListingStatusLabel(listing.status)}</Badge>
        </div>
        {listing.description ? <p className="text-sm leading-6 text-muted-foreground">{listing.description}</p> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-muted px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Cantidad</p>
            <p className="mt-1 font-semibold text-foreground">{listing.quantity}</p>
          </div>
          <div className="rounded-2xl bg-muted px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Caducidad</p>
            <p className="mt-1 font-semibold text-foreground">{formatDate(listing.expiration_date)}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Punto de retiro</p>
          <p className="mt-1 text-sm text-foreground">{listing.pickup_address ?? "Se compartirá al confirmar"}</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Publicado el {formatDate(listing.created_at)}</p>
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}