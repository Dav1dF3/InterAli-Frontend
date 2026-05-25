import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { ListingReserveButton } from "@/components/site/listing-reserve-button";
import { getFoodListing } from "@/lib/api";
import type { FoodListing } from "@/lib/types";

type ListingDetailPageProps = {
  params: Promise<{ listingId: string }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusLabel(status: FoodListing["status"]) {
  switch (status) {
    case "claimed":
      return "Reclamado";
    case "cancelled":
      return "Cancelado";
    default:
      return "Disponible";
  }
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { listingId } = await params;

  let listing: FoodListing;

  try {
    listing = await getFoodListing(listingId);
  } catch {
    notFound();
  }

  const isExpired = listing.expiration_date ? new Date(listing.expiration_date).getTime() < Date.now() : false;
  const canClaim = listing.status === "active" && !isExpired;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <SectionHeading
        eyebrow="Detalle"
        title={listing.title}
        description="Revisa la información y pide esta publicación si te interesa." 
      />

      <Card className="overflow-hidden border-border/70 bg-card/95 shadow-xl">
        <div className="h-1 bg-gradient-to-r from-primary/80 via-emerald-500/70 to-amber-400/70" />
        <CardHeader className="space-y-4 border-b border-border/60 bg-muted/20">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="rounded-full px-3 py-1 uppercase tracking-[0.18em]">
              {listing.category ?? "Categoría general"}
            </Badge>
            <Badge variant={listing.status === "active" && !isExpired ? "success" : listing.status === "claimed" ? "warning" : "destructive"} className="rounded-full px-3 py-1">
              {getStatusLabel(listing.status)}
            </Badge>
          </div>
          <CardTitle className="text-3xl text-balance">{listing.title}</CardTitle>
          {listing.description ? <CardDescription className="max-w-2xl text-base leading-7">{listing.description}</CardDescription> : null}
        </CardHeader>

        <CardContent className="space-y-8 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/60 bg-background px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Cantidad</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{listing.quantity}</p>
            </div>
            <div className="rounded-3xl border border-border/60 bg-background px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Disponible hasta</p>
              <p className="mt-2 text-base font-medium">{formatDate(listing.expiration_date)}</p>
            </div>
            <div className="rounded-3xl border border-border/60 bg-background px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Punto de retiro</p>
              <p className="mt-2 text-base font-medium">{listing.pickup_address ?? "Se compartirá al confirmar"}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-border/60 bg-background p-6">
              <p className="text-sm font-medium text-foreground">Qué puedes hacer con esta publicación</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Si te interesa, puedes entrar a tu cuenta y pasar directo a la zona de reserva para continuar el pedido.
              </p>
              {!canClaim ? (
                <p className="mt-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                  Esta publicación ya no se puede pedir.
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <ListingReserveButton listingId={listing.id} canClaim={canClaim} />
                <Button asChild variant="outline" className="rounded-full">
                  <a href="/food-listings">Volver al catálogo</a>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-muted/20 p-6">
              <p className="text-sm font-medium text-foreground">Publicación</p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                <p><span className="font-medium text-foreground">Publicado:</span> {formatDate(listing.created_at)}</p>
                <p><span className="font-medium text-foreground">Estado actual:</span> {getStatusLabel(listing.status)}</p>
                <p><span className="font-medium text-foreground">Punto de retiro:</span> {listing.pickup_address ?? "Se compartirá al confirmar"}</p>
                <p><span className="font-medium text-foreground">Aviso:</span> {isExpired ? "Esta publicación ya venció." : "Esta publicación sigue disponible si aparece como activa."}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}