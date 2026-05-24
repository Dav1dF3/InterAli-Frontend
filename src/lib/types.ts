export type UserRole = "donor" | "receiver" | "admin";

export type FoodListingStatus = "active" | "claimed" | "cancelled";

export type ClaimStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface UserPublic {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
}

export interface UserRead extends UserPublic {
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  user: UserRead;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string | null;
  password: string;
  confirm_password: string;
  role?: Exclude<UserRole, "admin">;
}

export type CurrentUserResponse = UserPublic;

export interface FoodListing {
  id: string;
  donor_id: string;
  title: string;
  description: string | null;
  quantity: number;
  category: string | null;
  expiration_date: string | null;
  pickup_address: string | null;
  status: FoodListingStatus;
  created_at: string;
}

export interface FoodListingsResponse {
  items: FoodListing[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateFoodListingRequest {
  title: string;
  description?: string | null;
  quantity: number;
  category?: string | null;
  expiration_date?: string | null;
  pickup_address?: string | null;
}

export interface UpdateFoodListingRequest extends Partial<CreateFoodListingRequest> {
  status?: FoodListingStatus;
}

export interface Claim {
  id: string;
  food_listing_id: string;
  receiver_id: string;
  status: ClaimStatus;
  created_at: string;
  updated_at: string;
  food_listing?: FoodListing | null;
}

export interface ClaimStatusUpdate {
  status: ClaimStatus;
}