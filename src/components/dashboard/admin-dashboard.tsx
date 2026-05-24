"use client";

import type { Claim, FoodListing } from "@/lib/types";
import { DonorDashboard } from "@/components/dashboard/donor-dashboard";

type AdminDashboardProps = {
  listings: FoodListing[];
  claims: Claim[];
  isLoading: boolean;
  errorMessage: string | null;
};

export function AdminDashboard(props: AdminDashboardProps) {
  return <DonorDashboard {...props} isAdmin />;
}