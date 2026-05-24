"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { DonorDashboard } from "@/components/dashboard/donor-dashboard";
import { ReceiverDashboard } from "@/components/dashboard/receiver-dashboard";
import { listDonorClaims, listFoodListings, listMyClaims } from "@/lib/api";
import { getStoredSession } from "@/lib/auth-storage";
import type { Claim, FoodListing } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const session = typeof window !== "undefined" ? getStoredSession() : null;
  const user = session?.user ?? null;

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [router, session]);

  const {
    data: listingsData,
    error: listingsError,
    isLoading: isListingsLoading,
  } = useSWR(session ? ["dashboard-listings"] : null, async () => {
    const response = await listFoodListings({ limit: 100, offset: 0 });
    return response.items;
  });

  const {
    data: claimsData,
    error: claimsError,
    isLoading: isClaimsLoading,
  } = useSWR(session ? ["dashboard-claims", user?.role] : null, async () => {
    if (user?.role === "receiver") {
      return listMyClaims();
    }

    return listDonorClaims();
  });

  if (!session) return null;

  const listings: FoodListing[] = listingsData ?? [];
  const claims: Claim[] = claimsData ?? [];
  const errorMessage = listingsError?.message ?? claimsError?.message ?? null;
  const isLoading = isListingsLoading || isClaimsLoading;

  if (user?.role === "receiver") {
    return <ReceiverDashboard listings={listings} claims={claims} isLoading={isLoading} errorMessage={errorMessage} />;
  }

  if (user?.role === "admin") {
    return <AdminDashboard listings={listings} claims={claims} isLoading={isLoading} errorMessage={errorMessage} />;
  }

  return <DonorDashboard listings={listings} claims={claims} isLoading={isLoading} errorMessage={errorMessage} />;
}