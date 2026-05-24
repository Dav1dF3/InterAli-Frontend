import type { Claim, FoodListing } from "@/lib/types";

export const privateStats: Array<{ label: string; value: string; delta: string }> = [];

export const privateActivities: Array<{ id: string; title: string; description: string; at: string; type: "success" | "warning" | "destructive" }> = [];

export const privateListings: FoodListing[] = [];

export const privateClaims: Claim[] = [];

export const listingCategoryOptions = ["Todas", "Granos", "Frutas", "Preparados", "Panadería"];

export const claimStatusOptions = ["Todos", "pending", "approved", "rejected", "cancelled"];

export function formatRelativeTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getListingStatusLabel(status: FoodListing["status"]) {
  switch (status) {
    case "claimed":
      return "Reclamado";
    case "cancelled":
      return "Cancelado";
    default:
      return "Activo";
  }
}

export function getListingStatusVariant(status: FoodListing["status"]) {
  switch (status) {
    case "claimed":
      return "warning";
    case "cancelled":
      return "destructive";
    default:
      return "success";
  }
}

export function getClaimStatusLabel(status: Claim["status"]) {
  switch (status) {
    case "approved":
      return "Aprobado";
    case "rejected":
      return "Rechazado";
    case "cancelled":
      return "Cancelado";
    default:
      return "Pendiente";
  }
}

export function getClaimStatusVariant(status: Claim["status"]) {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "destructive";
    case "cancelled":
      return "warning";
    default:
      return "outline";
  }
}