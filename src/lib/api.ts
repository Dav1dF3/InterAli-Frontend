import type {
  ClaimStatus,
  ClaimStatusUpdate,
  CreateFoodListingRequest,
  CurrentUserResponse,
  LoginRequest,
  RegisterRequest,
  UpdateFoodListingRequest,
} from "@/lib/types";
import { httpClient } from "@/api/http-client";
import { createClaim, getDonorClaims, getMyClaims, patchClaimStatus } from "@/services/claims.service";
import { getMe, login, register } from "@/services/auth.service";
import {
  createListing,
  getFoodListingById,
  getFoodListings,
  removeListing,
  updateListing,
} from "@/services/food-listings.service";

export async function getHealth() {
  const { data } = await httpClient.get<{ status: string }>("/health");
  return data;
}

export async function registerUser(payload: RegisterRequest) {
  return register(payload);
}

export async function loginUser(payload: LoginRequest) {
  return login(payload);
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  return getMe();
}

export async function listFoodListings(params: { limit?: number; offset?: number; category?: string; status?: string } = {}) {
  return getFoodListings(params);
}

export async function getFoodListing(listingId: string) {
  return getFoodListingById(listingId);
}

export async function createFoodListing(payload: CreateFoodListingRequest) {
  return createListing(payload);
}

export async function updateFoodListing(listingId: string, payload: UpdateFoodListingRequest) {
  return updateListing(listingId, payload);
}

export async function deleteFoodListing(listingId: string) {
  return removeListing(listingId);
}

export async function claimFoodListing(listingId: string) {
  return createClaim(listingId);
}

export async function listMyClaims(params: { status?: ClaimStatus } = {}) {
  return getMyClaims(params);
}

export async function listDonorClaims(params: { status?: ClaimStatus } = {}) {
  return getDonorClaims(params);
}

export async function updateClaimStatus(claimId: string, payload: ClaimStatusUpdate) {
  return patchClaimStatus(claimId, payload);
}