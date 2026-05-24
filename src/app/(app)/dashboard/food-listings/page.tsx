"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { MoreHorizontal, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePicker } from "@/components/ui/date-picker";
import { SectionHeading } from "@/components/site/section-heading";
import {
  claimFoodListing,
  createFoodListing,
  deleteFoodListing,
  listFoodListings,
  updateFoodListing,
} from "@/lib/api";
import { getStoredSession } from "@/lib/auth-storage";
import type { CreateFoodListingRequest, FoodListing } from "@/lib/types";
import { formatRelativeTime, getListingStatusLabel, getListingStatusVariant } from "@/lib/private-data";

const listingCategoryOptions = ["all", "Granos", "Frutas", "Preparados", "Panadería", "Verduras", "General"];

const emptyForm: CreateFoodListingRequest = {
  title: "",
  description: "",
  quantity: 1,
  category: "General",
  expiration_date: null,
  pickup_address: "",
};

function toIsoFromDateAndTime(date: Date | null, time: string) {
  if (!date) return null;

  const [hours, minutes] = time.split(":").map((segment) => Number(segment));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return date.toISOString();

  const merged = new Date(date);
  merged.setHours(hours, minutes, 0, 0);
  return merged.toISOString();
}

export default function DashboardFoodListingsPage() {
  const router = useRouter();
  const session = typeof window !== "undefined" ? getStoredSession() : null;
  const user = session?.user ?? null;
  const token = session?.access_token ?? null;
  const isDonor = user?.role === "donor";
  const isReceiver = user?.role === "receiver";
  const isAdmin = user?.role === "admin";

  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "claimed" | "cancelled">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateFoodListingRequest>(emptyForm);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [expirationTime, setExpirationTime] = useState("18:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [router, session]);

  const { data, error: fetchError, isLoading, mutate } = useSWR(
    session ? ["dashboard-food-listings"] : null,
    async () => {
      const response = await listFoodListings({ limit: 100, offset: 0 });
      return response.items;
    }
  );

  if (!session) return null;

  const listings: FoodListing[] = data ?? [];
  const pageSize = 6;

  const roleListings = isDonor ? listings.filter((listing) => listing.donor_id === user.id) : listings;

  const filteredListings = roleListings.filter((listing) => {
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
    if (isReceiver) {
      return matchesStatus && matchesCategory && listing.status === "active";
    }
    return matchesStatus && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / pageSize));
  const paginatedListings = filteredListings.slice((page - 1) * pageSize, page * pageSize);

  async function handleCreateListing() {
    if (!token) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createFoodListing({
        title: form.title,
        description: form.description || null,
        quantity: Number(form.quantity),
        category: form.category || null,
        pickup_address: form.pickup_address || null,
        expiration_date: toIsoFromDateAndTime(expirationDate, expirationTime),
      });
      setForm(emptyForm);
      setExpirationDate(null);
      setExpirationTime("18:00");
      setIsDialogOpen(false);
      await mutate();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear el listing");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteListing(listingId: string) {
    if (!token) return;
    try {
      await deleteFoodListing(listingId);
      await mutate();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo eliminar el listing");
    }
  }

  async function handleToggleCancel(listing: FoodListing) {
    if (!token) return;
    try {
      await updateFoodListing(listing.id, { status: listing.status === "cancelled" ? "active" : "cancelled" });
      await mutate();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo actualizar el listing");
    }
  }

  async function handleClaim(listingId: string) {
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await claimFoodListing(listingId);
      await mutate();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo reclamar el listing");
    }
  }

  const errorMessage = error ?? fetchError?.message ?? null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow={isDonor ? "Mis publicaciones" : isAdmin ? "Administración global" : "Comidas disponibles"}
          title={isDonor ? "Administración de publicaciones" : isAdmin ? "Administración total de publicaciones" : "Explorar y reclamar alimentos"}
          description={
            isDonor
              ? "Como donante puedes crear, cancelar/reactivar y eliminar tus publicaciones."
              : isAdmin
                ? "Como admin puedes revisar, cancelar/reactivar y eliminar cualquier publicación."
              : "Como receptor puedes revisar publicaciones activas y reclamarlas."
          }
        />

        {isDonor ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="size-4" />
                    Nueva publicación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear una nueva publicación</DialogTitle>
                <DialogDescription>Completa los datos para publicar comida disponible.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Ej. Bandejas preparadas"
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={form.category ?? "General"}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {listingCategoryOptions.filter((option) => option !== "all").map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(event) => setForm((prev) => ({ ...prev, quantity: Number(event.target.value || 1) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup">Dirección de retiro</Label>
                  <Input
                    id="pickup"
                    placeholder="Calle y número"
                    value={form.pickup_address ?? ""}
                    onChange={(event) => setForm((prev) => ({ ...prev, pickup_address: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiration">Fecha y hora de expiración</Label>
                  <DatePicker
                    value={expirationDate}
                    onChange={setExpirationDate}
                    placeholder="Selecciona una fecha"
                    minDate={new Date()}
                  />
                  <div className="flex items-center gap-3">
                    <Input
                      id="expiration-time"
                      type="time"
                      value={expirationTime}
                      onChange={(event) => setExpirationTime(event.target.value)}
                      className="w-40"
                    />
                    <p className="text-xs text-muted-foreground">Se enviará como fecha local + hora seleccionada.</p>
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    placeholder="Describe el lote y sus condiciones"
                    value={form.description ?? ""}
                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(emptyForm);
                    setExpirationDate(null);
                    setExpirationTime("18:00");
                    setIsDialogOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                  <Button onClick={() => void handleCreateListing()} disabled={isSubmitting || !form.title.trim()}>
                  {isSubmitting ? "Guardando..." : "Guardar publicación"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      {errorMessage ? (
        <Alert className="border-destructive/20 bg-destructive/10">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Alert className="border-primary/20 bg-primary/5">
        <AlertTitle>Estructura de trabajo</AlertTitle>
        <AlertDescription>
          {isDonor
            ? "Tu flujo: crear, cancelar/reactivar y eliminar tus publicaciones."
            : isAdmin
              ? "Tu flujo: revisar, cancelar/reactivar y eliminar cualquier publicación."
              : "Tu flujo: revisar publicaciones activas y crear reclamos."}
        </AlertDescription>
      </Alert>

      <Card className="border-border/70 bg-card/90">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardDescription>Filtros rápidos</CardDescription>
              <CardTitle>Refina por estado y categoría</CardTitle>
            </div>
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
              {isLoading ? "Cargando..." : `${filteredListings.length} resultados visibles`}
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as typeof statusFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="claimed">Reclamados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {listingCategoryOptions.filter((option) => option !== "all").map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-3">
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setPage(1);
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="table" className="w-full gap-6">
            <TabsList variant="line" className="grid w-full grid-cols-2 justify-stretch gap-2 border-b border-border/60 pb-0">
              <TabsTrigger value="table" className="rounded-t-lg">Tabla</TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-t-lg">Contexto</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Publicado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedListings.map((listing) => (
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
                      <TableCell>{formatRelativeTime(listing.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full">
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Acciones</span>
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Acciones</TooltipContent>
                          </Tooltip>
                          <DropdownMenuContent align="end" className="w-48">
                            {isDonor || isAdmin ? (
                              <>
                                <DropdownMenuItem onClick={() => void handleToggleCancel(listing)}>
                                  {listing.status === "cancelled" ? "Reactivar" : "Cancelar"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => void handleDeleteListing(listing.id)}>Eliminar</DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem onClick={() => void handleClaim(listing.id)}>Reclamar</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setPage((prev) => Math.max(1, prev - 1))} text="Anterior" href="#" />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink isActive={i + 1 === page} href="#" onClick={() => setPage(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} text="Siguiente" href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="pt-6">
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredListings.slice(0, 2).map((listing) => (
                  <Card key={listing.id} className="border-border/60 bg-background/60">
                    <CardHeader>
                      <CardDescription>{listing.category ?? "General"}</CardDescription>
                      <CardTitle className="text-xl">{listing.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                      <p>{listing.description ?? "Sin descripción"}</p>
                      <p>
                        Estado actual: <span className="font-medium text-foreground">{getListingStatusLabel(listing.status)}</span>
                      </p>
                      <p>Última actualización visual: {formatRelativeTime(listing.created_at)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
