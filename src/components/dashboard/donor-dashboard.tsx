"use client";

import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Claim, FoodListing } from "@/lib/types";
import { formatRelativeTime, getClaimStatusLabel, getClaimStatusVariant, getListingStatusLabel, getListingStatusVariant } from "@/lib/private-data";

type DonorDashboardProps = {
  listings: FoodListing[];
  claims: Claim[];
  isLoading: boolean;
  errorMessage: string | null;
  isAdmin?: boolean;
};

export function DonorDashboard({ listings, claims, isLoading, errorMessage, isAdmin = false }: DonorDashboardProps) {
  const myListings = listings;
  const activeListings = myListings.filter((listing) => listing.status === "active").length;
  const resolvedClaims = claims.filter((claim) => claim.status === "delivered" || claim.status === "picked_up" || claim.status === "approved").length;
  const title = isAdmin ? "Coordinación de publicaciones" : "Publicaciones y trazabilidad";
  const description = isAdmin
    ? "Supervisa publicaciones, reclamos y cierres operativos sin mezclar tareas de donante con tareas de coordinación."
    : "Publica excedentes rápido, revisa lo que sigue activo y abre el historial para ver impacto.";
  const primaryActionLabel = isAdmin ? "Abrir revisión global" : "Nueva publicación";
  const secondaryActionLabel = isAdmin ? "Ver cola de reclamos" : "Ver historial e impacto";
  const recentClaimsTitle = isAdmin ? "Movimientos de coordinación" : "Movimientos recientes";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">{isAdmin ? "Coordinación" : "Donante"}</Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        </div>
      </div>

      {errorMessage ? (
        <Alert className="border-destructive/20 bg-destructive/10">
          <AlertTitle>Error al cargar información</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Publicaciones activas", value: activeListings, delta: "Listas para ser vistas" },
          { label: "Total de publicaciones", value: myListings.length, delta: "Historial del negocio" },
          { label: "Claims resueltos", value: resolvedClaims, delta: "Impacto operativo" },
        ].map((metric) => (
          <Card key={metric.label} className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-4xl tracking-tight">{isLoading ? "..." : metric.value}</CardTitle>
              <p className="text-sm text-muted-foreground">{metric.delta}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-full">
          <Link href="/dashboard/food-listings">{primaryActionLabel}</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard/impact">{secondaryActionLabel}</Link>
        </Button>
      </div>

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardDescription>Lo más reciente</CardDescription>
          <CardTitle>Últimas publicaciones y movimientos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border/60 bg-background p-4">
            <p className="text-sm font-medium text-foreground">Publicaciones recientes</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myListings.slice(0, 5).map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(listing.created_at)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getListingStatusVariant(listing.status)}>{getListingStatusLabel(listing.status)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-3xl border border-border/60 bg-background p-4">
            <p className="text-sm font-medium text-foreground">{recentClaimsTitle}</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Publicación</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.slice(0, 5).map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{claim.food_listing?.title ?? claim.food_listing_id}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(claim.updated_at)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getClaimStatusVariant(claim.status)}>{getClaimStatusLabel(claim.status)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}