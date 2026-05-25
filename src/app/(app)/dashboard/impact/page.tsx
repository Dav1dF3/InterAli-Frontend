"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listDonorClaims, listFoodListings } from "@/lib/api";
import { getStoredSession } from "@/lib/auth-storage";
import type { Claim, FoodListing } from "@/lib/types";
import { formatRelativeTime, getClaimStatusLabel, getClaimStatusVariant, getListingStatusLabel, getListingStatusVariant } from "@/lib/private-data";

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ImpactPage() {
  const router = useRouter();
  const session = typeof window !== "undefined" ? getStoredSession() : null;
  const user = session?.user ?? null;
  const isAdmin = user?.role === "admin";
  const isVolunteer = user?.role === "volunteer";
  const isDonor = user?.role === "donor";
  const isReceiver = user?.role === "receiver";

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [router, session]);

  const { data: listingsData, error: listingsError, isLoading: isListingsLoading } = useSWR(session ? ["impact-listings", user?.role] : null, async () => {
    const response = await listFoodListings({ limit: 100, offset: 0 });
    return response.items;
  });

  const { data: claimsData, error: claimsError, isLoading: isClaimsLoading } = useSWR(session ? ["impact-claims", user?.role] : null, async () => {
    return listDonorClaims();
  });

  if (!session) return null;

  const listings: FoodListing[] = listingsData ?? [];
  const claims: Claim[] = claimsData ?? [];
  const errorMessage = listingsError?.message ?? claimsError?.message ?? null;

  const totalPublished = listings.length;
  const activePublished = listings.filter((listing) => listing.status === "active").length;
  const finishedClaims = claims.filter((claim) => claim.status === "delivered" || claim.status === "picked_up" || claim.status === "approved").length;
  const activeClaims = claims.filter((claim) => claim.status === "pending" || claim.status === "approved" || claim.status === "picked_up").length;

  const csvRows = [["tipo", "titulo", "estado", "cantidad", "actualizado"]];

  listings.slice(0, 50).forEach((listing) => {
    csvRows.push(["publicacion", listing.title, getListingStatusLabel(listing.status), String(listing.quantity), formatRelativeTime(listing.created_at)]);
  });

  claims.slice(0, 50).forEach((claim) => {
    csvRows.push(["solicitud", claim.food_listing?.title ?? claim.food_listing_id, getClaimStatusLabel(claim.status), claim.food_listing?.quantity ? String(claim.food_listing.quantity) : "", formatRelativeTime(claim.updated_at)]);
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
          {isAdmin ? "Coordinación e impacto" : isVolunteer ? "Asignaciones e impacto" : isDonor ? "Historial de donaciones" : isReceiver ? "Historial de solicitudes" : "Historial e impacto"}
        </Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            {isAdmin
              ? "Visión global de coordinación"
              : isVolunteer
                ? "Tu historial de asignaciones"
                : isDonor
                  ? "Tu historial de donaciones"
                  : isReceiver
                    ? "Tu historial de solicitudes"
                    : "Tu historial"}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {isAdmin
              ? "Revisa publicaciones y solicitudes a escala global para coordinar sin mezclar tareas de donante."
              : isVolunteer
                ? "Revisa las asignaciones en las que trabajaste y su estado: aceptadas, recogidas o entregadas."
                : isDonor
                  ? "Revisa lo que publicaste, lo que sigue activo y lo que ya se movió. Sin paneles pesados, solo lo útil."
                  : isReceiver
                    ? "Revisa tus solicitudes, su estado y el historial de entregas que recibiste."
                    : "Revisa actividad e impacto."}
          </p>
        </div>
      </div>

      {errorMessage ? (
        <Alert className="border-destructive/20 bg-destructive/10">
          <AlertTitle>Error al cargar información</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Publicaciones", value: totalPublished, delta: "Totales" },
          { label: "Activas", value: activePublished, delta: "Disponibles" },
          { label: "Solicitudes activas", value: activeClaims, delta: "En movimiento" },
          { label: "Movimientos cerrados", value: finishedClaims, delta: "Con seguimiento" },
        ].map((metric) => (
          <Card key={metric.label} className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-4xl tracking-tight">{isListingsLoading || isClaimsLoading ? "..." : metric.value}</CardTitle>
              <p className="text-sm text-muted-foreground">{metric.delta}</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => downloadCsv(`interali-impacto-${new Date().toISOString().slice(0, 10)}.csv`, csvRows)} className="rounded-full">
          Exportar CSV
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard">{isAdmin ? "Volver a coordinación" : "Volver al espacio"}</Link>
        </Button>
      </div>

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardDescription>Lo último</CardDescription>
          <CardTitle>Publicaciones y solicitudes recientes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border/60 bg-background p-4">
            <p className="text-sm font-medium text-foreground">Publicaciones</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.slice(0, 5).map((listing) => (
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
            <p className="text-sm font-medium text-foreground">Solicitudes</p>
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
