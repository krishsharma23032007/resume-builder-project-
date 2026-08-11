import { api } from "./apiClient";

export interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  linkedin: string;
  website: string;
  github: string;
}

export type UpdateProfilePayload = Partial<Omit<UserProfile, "email">>;

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    return api.get("/api/profile");
  },

  async updateProfile(data: UpdateProfilePayload): Promise<{ message: string }> {
    return api.put("/api/profile", data);
  }
};
