"use client";

import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Claim, FoodListing } from "@/lib/types";
import { formatRelativeTime, getClaimStatusLabel, getClaimStatusVariant } from "@/lib/private-data";

type VolunteerDashboardProps = {
  listings: FoodListing[];
  claims: Claim[];
  isLoading: boolean;
  errorMessage: string | null;
};

export function VolunteerDashboard({ listings, claims, isLoading, errorMessage }: VolunteerDashboardProps) {
  const assignedClaims = claims.filter((claim) => claim.volunteer_id !== null);
  const activeAssignedClaims = assignedClaims.filter((claim) => claim.status === "approved" || claim.status === "picked_up");
  const pendingAcceptance = assignedClaims.filter((claim) => claim.status === "approved" && claim.volunteer_accepted_at === null);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">Voluntario</Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Asignaciones de recogida</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Aquí ves solo lo que depende de ti: aceptar la asignación, confirmar recogida y cerrar la entrega.
          </p>
        </div>
      </div>

      {errorMessage ? (
        <Alert className="border-destructive/20 bg-destructive/10">
          <AlertTitle>Error al cargar información</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Alert className="border-primary/20 bg-primary/5">
        <AlertTitle>Tu trabajo</AlertTitle>
        <AlertDescription>Responder a asignaciones y confirmar el avance del retiro sin pasos innecesarios.</AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Asignaciones activas", value: activeAssignedClaims.length, delta: "Pendientes de completar" },
          { label: "Pendientes de aceptar", value: pendingAcceptance.length, delta: "Esperando tu decisión" },
          { label: "Total asignadas", value: assignedClaims.length, delta: "Historial operativo" },
          { label: "Publicaciones disponibles", value: listings.filter((listing) => listing.status === "active").length, delta: "Contexto de retiro" },
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

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardDescription>Tu cola de trabajo</CardDescription>
          <CardTitle>Asignaciones que dependen de ti</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Recogida</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedClaims.slice(0, 8).map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{claim.food_listing?.title ?? claim.food_listing_id}</p>
                      <p className="text-xs text-muted-foreground">{claim.food_listing?.pickup_address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getClaimStatusVariant(claim.status)}>{getClaimStatusLabel(claim.status)}</Badge>
                    {claim.volunteer_accepted_at === null && claim.status === "approved" ? (
                      <p className="mt-1 text-xs text-muted-foreground">Asignación pendiente de aceptar</p>
                    ) : null}
                  </TableCell>
                  <TableCell>{claim.pickup_confirmed_at ? formatRelativeTime(claim.pickup_confirmed_at) : "Pendiente"}</TableCell>
                  <TableCell>{claim.delivered_confirmed_at ? formatRelativeTime(claim.delivered_confirmed_at) : "Pendiente"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {claim.status === "approved" && claim.volunteer_accepted_at === null ? (
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                          <Link href="/dashboard/claims">Aceptar o rechazar asignación</Link>
                        </Button>
                      ) : null}
                      <Button asChild variant="outline" size="sm" className="rounded-full">
                        <Link href="/dashboard/claims">Abrir asignaciones</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
