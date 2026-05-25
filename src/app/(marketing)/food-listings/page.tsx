import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodListingCard } from "@/components/site/food-listing-card";
import { SectionHeading } from "@/components/site/section-heading";
import { listFoodListings } from "@/lib/api";
import type { FoodListing } from "@/lib/types";

const fallbackListings: FoodListing[] = [];

async function loadListings() {
  try {
    const response = await listFoodListings({ limit: 12, offset: 0 });
    return response.items;
  } catch {
    return fallbackListings;
  }
}

export default async function PublicListingsPage() {
  const listings = await loadListings();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <SectionHeading
        eyebrow="Publicaciones"
        title="Excedentes disponibles"
        description="Lo que está libre ahora para que alguien lo pida y lo mueva rápido."
      />

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <Badge variant="outline" className="w-fit rounded-full px-3 py-1">Disponibles</Badge>
          <CardTitle>Últimas publicaciones</CardTitle>
          <CardDescription>
            Aquí ves las publicaciones recientes. Si una te sirve, abre el detalle y sigue el flujo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {listings.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {listings.map((listing) => (
                <FoodListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/70 px-6 py-10 text-center">
              <p className="text-base font-medium text-foreground">Todavía no hay publicaciones.</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Cuando alguien publique excedentes, aparecerán aquí.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}