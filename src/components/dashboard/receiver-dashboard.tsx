"use client";

import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Claim, FoodListing } from "@/lib/types";
import { formatRelativeTime, getClaimStatusLabel, getClaimStatusVariant, getListingStatusLabel, getListingStatusVariant } from "@/lib/private-data";

type ReceiverDashboardProps = {
  listings: FoodListing[];
  claims: Claim[];
  isLoading: boolean;
  errorMessage: string | null;
};

export function ReceiverDashboard({ listings, claims, isLoading, errorMessage }: ReceiverDashboardProps) {
  const availableListings = listings.filter((listing) => listing.status === "active");
  const openClaims = claims.filter((claim) => claim.status === "pending" || claim.status === "approved" || claim.status === "picked_up");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">Receptor</Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Comida disponible</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Mira lo que está libre, pide lo que necesitas y sigue tus solicitudes sin distracciones.
          </p>
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
          { label: "Comidas activas", value: availableListings.length, delta: "Disponibles para pedir" },
          { label: "Mis solicitudes", value: claims.length, delta: "Historial personal" },
          { label: "Solicitudes en curso", value: openClaims.length, delta: "Pendientes de cierre" },
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
          <Link href="/food-listings">Ver publicaciones</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard/claims">Mis solicitudes</Link>
        </Button>
      </div>

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardDescription>Comidas activas</CardDescription>
          <CardTitle>Lo que puedes pedir ahora</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableListings.slice(0, 5).map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-xs text-muted-foreground">{listing.pickup_address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getListingStatusVariant(listing.status)}>{getListingStatusLabel(listing.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={`/food-listings/${listing.id}`}>Pedir</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardDescription>Mis solicitudes</CardDescription>
          <CardTitle>Seguimiento simple</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Actualizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.slice(0, 5).map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.food_listing?.title ?? claim.food_listing_id}</TableCell>
                  <TableCell>
                    <Badge variant={getClaimStatusVariant(claim.status)}>{getClaimStatusLabel(claim.status)}</Badge>
                  </TableCell>
                  <TableCell>{formatRelativeTime(claim.updated_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}