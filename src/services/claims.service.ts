import { httpClient } from "@/api/http-client";
import type { Claim, ClaimStatus, ClaimStatusUpdate } from "@/lib/types";

export async function createClaim(listingId: string) {
  const { data } = await httpClient.post<Claim>(`/food-listings/${listingId}/claim`);
  return data;
}

export async function getMyClaims(params: { status?: ClaimStatus } = {}) {
  const { data } = await httpClient.get<Claim[]>("/claims/me", { params });
  return data;
}

export async function getDonorClaims(params: { status?: ClaimStatus } = {}) {
  const { data } = await httpClient.get<Claim[]>("/claims/donor", { params });
  return data;
}

export async function getVolunteerClaims(params: { status?: ClaimStatus } = {}) {
  const { data } = await httpClient.get<Claim[]>("/claims/volunteer", { params });
  return data;
}

export async function patchClaimStatus(claimId: string, payload: ClaimStatusUpdate) {
  const { data } = await httpClient.patch<Claim>(`/claims/${claimId}/status`, payload);
  return data;
}
