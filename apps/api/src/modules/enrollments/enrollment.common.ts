export const clientEnrollmentSelect = {
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  program: {
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      imageUrl: true,
      duration: true,
      format: true,
    },
  },
} as const;

export const cmsEnrollmentSelect = {
  ...clientEnrollmentSelect,
  user: {
    select: {
      id: true,
      email: true,
      clientProfile: {
        select: {
          fullName: true,
          phone: true,
        },
      },
    },
  },
} as const;

export function isPrismaError(error: unknown, code: string) {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}
