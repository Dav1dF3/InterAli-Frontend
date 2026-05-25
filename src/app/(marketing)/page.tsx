import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodListingCard } from "@/components/site/food-listing-card";
import { SectionHeading } from "@/components/site/section-heading";
import { listFoodListings } from "@/lib/api";
import type { FoodListing } from "@/lib/types";

const featuredFallback: FoodListing[] = [];

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
              Redistribución local de alimentos
            </Badge>
            <span className="text-sm text-muted-foreground">Un flujo simple para publicar excedentes, moverlos y confirmar la entrega.</span>
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
              Conecta comida disponible con quienes realmente la necesitan en Ibagué.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              InterAli ayuda a donar, recoger y entregar alimentos sin perder tiempo en procesos pesados ni pantallas innecesarias.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/register">Empezar ahora</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/food-listings">Ver publicaciones</Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/80 px-4 py-4 text-sm leading-6 text-muted-foreground">
            Donante, receptor y voluntario trabajando sobre el mismo flujo, con confirmación y trazabilidad simple.
          </div>
        </div>

        <Card className="overflow-hidden border-border/70 bg-card/90 shadow-xl">
          <CardHeader className="space-y-3 border-b border-border/60 bg-muted/40">
            <CardDescription>Cómo funciona</CardDescription>
            <CardTitle className="text-2xl">Tres pasos, sin vueltas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6">
            {[
              ["Donante", "Publica el excedente con cantidad, fecha límite y ubicación."],
              ["Voluntario", "Acepta la recogida y confirma el movimiento."],
              ["Receptor", "Recibe y confirma la entrega."],
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
          eyebrow="Publicaciones"
          title="Excedentes recientes"
          description="Lo último publicado para que alguien lo tome sin fricción."
          action={
            <Button asChild variant="outline">
              <Link href="/food-listings">Ver todo</Link>
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
        <p className="text-sm font-medium text-foreground">Pensado para una operación real</p>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
          La prioridad es mover alimentos rápido, con pocas pantallas y seguimiento suficiente para validar el impacto.
        </p>
      </section>
    </div>
  );
}