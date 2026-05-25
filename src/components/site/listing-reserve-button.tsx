"use client";

import Link from "next/link";

import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { listMyClaims } from "@/lib/api";

type ListingReserveButtonProps = {
  listingId: string;
  canClaim?: boolean;
};

export function ListingReserveButton({ listingId, canClaim = true }: ListingReserveButtonProps) {
  const { isAuthenticated } = useAuth();
  const { data: claims } = useSWR(isAuthenticated ? ["listing-reserve-button-claims", listingId] : null, async () => listMyClaims());

  const hasRejectedClaim = Boolean(claims?.some((claim) => claim.food_listing_id === listingId && claim.status === "rejected"));
  const isDisabled = !canClaim || hasRejectedClaim;
  const target = isAuthenticated
    ? `/dashboard/food-listings?tab=reserve&listing=${encodeURIComponent(listingId)}`
    : `/login?next=${encodeURIComponent(`/dashboard/food-listings?tab=reserve&listing=${listingId}`)}`;

  if (isDisabled) {
    return (
      <Button className="rounded-full" disabled>
        {hasRejectedClaim ? "Pedido rechazado" : "Ya no disponible"}
      </Button>
    );
  }

  return (
    <Button asChild className="rounded-full">
      <Link href={target}>Reclamar</Link>
    </Button>
  );
}