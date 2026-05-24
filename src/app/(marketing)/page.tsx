import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodListingCard } from "@/components/site/food-listing-card";
import { SectionHeading } from "@/components/site/section-heading";
import { listFoodListings } from "@/lib/api";
import type { FoodListing } from "@/lib/types";

const featuredFallback: FoodListing[] = [
  {
    id: "demo-1",
    donor_id: "demo-donor-1",
    title: "Paquetes de arroz",
    description: "Lote listo para entregar con productos secos en excelente estado.",
    quantity: 24,
    category: "Granos",
    expiration_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    pickup_address: "Mercado Central 100",
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    donor_id: "demo-donor-2",
    title: "Frutas de temporada",
    description: "Caja mixta con fruta fresca para consumo inmediato.",
    quantity: 18,
    category: "Frutas",
    expiration_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    pickup_address: "Av. Libertad 242",
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    donor_id: "demo-donor-3",
    title: "Bandejas preparadas",
    description: "Alimentos cocinados y empacados para distribución coordinada.",
    quantity: 12,
    category: "Preparados",
    expiration_date: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    pickup_address: "Calle Norte 15",
    status: "active",
    created_at: new Date().toISOString(),
  },
];

async function loadFeaturedListings() {
  try {
    const response = await listFoodListings({ limit: 3, offset: 0 });
    return response.items;
  } catch {
    return featuredFallback;
  }
}

export default async function MarketingHomePage() {
  const featuredListings = await loadFeaturedListings();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              Donación de alimentos
            </Badge>
            <span className="text-sm text-muted-foreground">Un flujo claro para publicar, reclamar y coordinar entregas sin ruido.</span>
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
              Conecta excedentes de comida con personas que sí los necesitan.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              InterAli organiza la oferta pública de alimentos, facilita la publicación de donors y el reclamo de
              receivers con una interfaz directa, consistente y conectada al backend real.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/register">Empezar ahora</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/food-listings">Ver comidas disponibles</Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/80 px-4 py-4 text-sm leading-6 text-muted-foreground">
            Publica, reclama y sigue el estado de cada alimento sin pasos innecesarios.
          </div>
        </div>

        <Card className="overflow-hidden border-border/70 bg-card/90 shadow-xl">
          <CardHeader className="space-y-3 border-b border-border/60 bg-muted/40">
            <CardDescription>Vista previa de la plataforma</CardDescription>
            <CardTitle className="text-2xl">Flujo diseñado para operar sin traducciones mentales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6">
            {[
              ["Donor publica", "Carga título, descripción, cantidad, categoría y punto de retiro."],
              ["Receiver reclama", "La app valida autenticación, estado y expiración antes de crear el claim."],
              ["Estado sincronizado", "El listing cambia de forma automática según el claim y su resolución."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-border/60 bg-background px-4 py-4">
                <p className="font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Disponibles ahora"
          title="Alimentos publicados recientemente"
          description="El frontend está preparado para consumir la API pública de listings y mostrar la oferta en tiempo real."
          action={
            <Button asChild variant="outline">
              <Link href="/food-listings">Abrir catálogo completo</Link>
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <FoodListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <p className="text-sm font-medium text-foreground">Diseñado para dos tareas concretas</p>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          Donors publican y gestionan listings. Receivers exploran, reclaman y siguen sus solicitudes. No hay
          funcionalidades decorativas ni pantallas vacías.
        </p>
      </section>
    </div>
  );
}