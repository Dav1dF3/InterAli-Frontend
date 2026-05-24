"use client";

import Link from "next/link";
import { ChevronRight, CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Claim, FoodListing } from "@/lib/types";
import { formatRelativeTime, getClaimStatusLabel, getClaimStatusVariant, getListingStatusLabel, getListingStatusVariant } from "@/lib/private-data";

type ReceiverDashboardProps = {
  listings: FoodListing[];
  claims: Claim[];
  isLoading: boolean;
  errorMessage: string | null;
};

export function ReceiverDashboard({ listings, claims, isLoading, errorMessage }: ReceiverDashboardProps) {
  const activeListings = listings.filter((listing) => listing.status === "active");
  const pendingClaims = claims.filter((claim) => claim.status === "pending");
  const approvedClaims = claims.filter((claim) => claim.status === "approved");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">Receptor</Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Explorar y reclamar</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Aquí el foco está en descubrir publicaciones activas, revisar tus reclamos y seguir su estado.
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
        <CircleAlert className="size-4" />
        <AlertTitle>Tu tarea</AlertTitle>
        <AlertDescription>Reclamar comida disponible y seguir el estado de tus solicitudes.</AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Publicaciones activas", value: activeListings.length, delta: "Disponibles para reclamar" },
          { label: "Reclamos pendientes", value: pendingClaims.length, delta: "En revisión" },
          { label: "Reclamos aprobados", value: approvedClaims.length, delta: "Ya confirmados" },
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

      <Tabs defaultValue="listings" className="w-full gap-6">
        <TabsList variant="line" className="grid w-full grid-cols-2 justify-stretch gap-2 border-b border-border/60 pb-0">
          <TabsTrigger value="listings" className="rounded-t-lg">Publicaciones activas</TabsTrigger>
          <TabsTrigger value="claims" className="rounded-t-lg">Mis reclamos</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="pt-6">
          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardDescription>Oportunidades disponibles</CardDescription>
              <CardTitle>Selecciona una publicación para reclamar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeListings.slice(0, 8).map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-xs text-muted-foreground">{listing.pickup_address}</p>
                        </div>
                      </TableCell>
                      <TableCell>{listing.category ?? "General"}</TableCell>
                      <TableCell>{listing.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={getListingStatusVariant(listing.status)}>{getListingStatusLabel(listing.status)}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                          <Link href="/dashboard/food-listings">Abrir</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="pt-6">
          <Card className="border-border/70 bg-card/90">
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
              <div>
                <CardDescription>Seguimiento personal</CardDescription>
                <CardTitle>Estado de tus reclamos</CardTitle>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/dashboard/claims">
                  Ver todos
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
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
                  {claims.slice(0, 8).map((claim) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}