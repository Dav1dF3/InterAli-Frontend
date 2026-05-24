import { httpClient } from "@/api/http-client";
import type { CreateFoodListingRequest, FoodListing, FoodListingsResponse, UpdateFoodListingRequest } from "@/lib/types";

export async function getFoodListings(params: { limit?: number; offset?: number; category?: string; status?: string } = {}) {
  const { data } = await httpClient.get<FoodListingsResponse>("/food-listings", { params });
  return data;
}

export async function getFoodListingById(listingId: string) {
  const { data } = await httpClient.get<FoodListing>(`/food-listings/${listingId}`);
  return data;
}

export async function createListing(payload: CreateFoodListingRequest) {
  const { data } = await httpClient.post<FoodListing>("/food-listings", payload);
  return data;
}

export async function updateListing(listingId: string, payload: UpdateFoodListingRequest) {
  const { data } = await httpClient.patch<FoodListing>(`/food-listings/${listingId}`, payload);
  return data;
}

export async function removeListing(listingId: string) {
  await httpClient.delete(`/food-listings/${listingId}`);
}
