export type ExperienceLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type EnrollmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

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

export interface ClientEnrollment {
  id: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  program: {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string | null;
    duration: string | null;
    format: string | null;
  };
}
