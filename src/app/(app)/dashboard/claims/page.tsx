"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SectionHeading } from "@/components/site/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listDonorClaims, listMyClaims, updateClaimStatus } from "@/lib/api";
import { getStoredSession } from "@/lib/auth-storage";
import type { Claim, ClaimStatus } from "@/lib/types";
import { formatRelativeTime, getClaimStatusLabel, getClaimStatusVariant } from "@/lib/private-data";

export default function DashboardClaimsPage() {
  const router = useRouter();
  const session = typeof window !== "undefined" ? getStoredSession() : null;
  const user = session?.user ?? null;
  const token = session?.access_token ?? null;
  const isReceiver = user?.role === "receiver";
  const isAdmin = user?.role === "admin";

  const [tab, setTab] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [updatingClaimId, setUpdatingClaimId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [router, session]);

  const { data, error: fetchError, isLoading, mutate } = useSWR(
    session ? ["dashboard-claims", user?.role] : null,
    async () => {
      if (isReceiver) {
        return listMyClaims();
      }
      return listDonorClaims();
    }
  );

  if (!session) return null;

  const claims: Claim[] = data ?? [];
  const sortedClaims = [...claims].sort((left, right) => new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime());
  const filteredClaims =
    tab === "all"
      ? sortedClaims
      : tab === "resolved"
        ? sortedClaims.filter((claim) => claim.status !== "pending")
        : sortedClaims.filter((claim) => claim.status === tab);
  const errorMessage = error ?? fetchError?.message ?? null;

  async function handleUpdateClaimStatus(claimId: string, status: ClaimStatus) {
    if (!token) return;
    setUpdatingClaimId(claimId);
    setError(null);
    try {
      await updateClaimStatus(claimId, { status });
      await mutate();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo actualizar el claim");
    } finally {
      setUpdatingClaimId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <SectionHeading
        eyebrow="Reclamos"
        title="Reclamos y seguimiento"
        description="Consulta el estado de cada reclamo y actúa sólo cuando corresponda."
      />

      {errorMessage ? (
        <Alert className="border-destructive/20 bg-destructive/10">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-3 rounded-3xl border border-border/70 bg-card/90 p-4 sm:grid-cols-3">
        {[
          { label: "Pendientes", value: claims.filter((claim) => claim.status === "pending").length },
          { label: "Aprobados", value: claims.filter((claim) => claim.status === "approved").length },
          { label: "Resueltos", value: claims.filter((claim) => claim.status !== "pending").length },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/60 bg-background px-4 py-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{isLoading ? "..." : item.value}</p>
          </div>
        ))}
      </div>

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardDescription>
            {isReceiver
              ? "Tus reclamos"
              : isAdmin
                ? "Reclamos globales"
                : "Reclamos de tus publicaciones"}
          </CardDescription>
          <CardTitle>
            {isReceiver ? "Estado de tus reclamos" : isAdmin ? "Gestionar reclamos globales" : "Gestionar reclamos de tus publicaciones"}
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            {isReceiver
              ? "Consulta el estado y la última actualización de cada reclamo."
              : "Revisa el estado general y actúa sólo cuando corresponda."}
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full gap-6">
            <TabsList variant="line" className="grid w-full grid-cols-4 justify-stretch gap-2 border-b border-border/60 pb-0">
              <TabsTrigger value="all" className="rounded-t-lg">Todos</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-t-lg">Pendientes</TabsTrigger>
              <TabsTrigger value="approved" className="rounded-t-lg">Aprobados</TabsTrigger>
              <TabsTrigger value="resolved" className="rounded-t-lg">Resueltos</TabsTrigger>
            </TabsList>

            <TabsContent value={tab} className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reclamo</TableHead>
                    <TableHead>Publicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Última actualización</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-mono text-xs">{claim.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{claim.food_listing?.title ?? claim.food_listing_id}</p>
                          <p className="text-xs text-muted-foreground">{claim.food_listing?.pickup_address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getClaimStatusVariant(claim.status)}>{getClaimStatusLabel(claim.status)}</Badge>
                      </TableCell>
                      <TableCell>{formatRelativeTime(claim.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        {isReceiver ? (
                          <span className="text-xs text-muted-foreground">Solo lectura</span>
                        ) : claim.status !== "pending" ? (
                          <span className="text-xs text-muted-foreground">Ya resuelto</span>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="rounded-full" disabled={updatingClaimId === claim.id}>
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Acciones</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuItem onClick={() => void handleUpdateClaimStatus(claim.id, "approved")}>Aprobar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => void handleUpdateClaimStatus(claim.id, "rejected")}>Rechazar</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => void handleUpdateClaimStatus(claim.id, "cancelled")}>Cancelar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
