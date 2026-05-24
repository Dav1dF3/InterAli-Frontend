"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const ownedListings = listings;
  const pendingClaims = claims.filter((claim) => claim.status === "pending");
  const approvedClaims = claims.filter((claim) => claim.status === "approved");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit rounded-full px-3 py-1">{isAdmin ? "Admin / Donante" : "Donante"}</Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Publicar y administrar</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Aquí el foco está en crear publicaciones, controlar su estado y responder reclamos sobre tus publicaciones.
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
        <AlertDescription>
          {isAdmin
            ? "Como admin supervisas publicaciones y reclamos globales; como donante, gestionas sólo tus publicaciones."
            : "Como donante publicas comida disponible y decides si un reclamo se aprueba, rechaza o cancela."}
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: isAdmin ? "Publicaciones globales" : "Mis publicaciones", value: ownedListings.length, delta: "Publicaciones visibles" },
          { label: "Reclamos pendientes", value: pendingClaims.length, delta: "Para revisar" },
          { label: "Reclamos aprobados", value: approvedClaims.length, delta: "Confirmados" },
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

      <div className="flex justify-end">
        <Button asChild className="rounded-full">
          <Link href="/dashboard/food-listings">
            <Plus className="size-4" />
            {isAdmin ? "Gestionar publicaciones" : "Nueva publicación"}
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="listings" className="w-full gap-6">
        <TabsList variant="line" className="grid w-full grid-cols-2 justify-stretch gap-2 border-b border-border/60 pb-0">
          <TabsTrigger value="listings" className="rounded-t-lg">Mis publicaciones</TabsTrigger>
          <TabsTrigger value="claims" className="rounded-t-lg">Reclamos</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="pt-6">
          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardDescription>{isAdmin ? "Listado global" : "Tus publicaciones"}</CardDescription>
              <CardTitle>{isAdmin ? "Publicaciones de toda la plataforma" : "Publicaciones activas y gestionables"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownedListings.slice(0, 8).map((listing) => (
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
                        <Button asChild variant="ghost" size="sm" className="rounded-full">
                          <Link href="/dashboard/food-listings">Ver</Link>
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
            <CardHeader>
              <CardDescription>Respuesta a reclamos</CardDescription>
              <CardTitle>{isAdmin ? "Reclamos globales" : "Reclamos sobre tus publicaciones"}</CardTitle>
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