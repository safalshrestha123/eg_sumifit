export type ExperienceLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ClientProfile {
  id: string;
  fullName: string;
  phone: string | null;
  fitnessGoal: string | null;
  experienceLevel: ExperienceLevel | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfileResponse {
  email: string;
  profile: ClientProfile | null;
}
