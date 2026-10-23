import type { UserRole } from "../../../generated/prisma";

/**
 * Where a signed-in user belongs: teachers on the command center, the
 * registrar (admin) on the admin portal, students on their own dashboard.
 */
export function homeForRole(role: UserRole | null | undefined): string {
  switch (role) {
    case "TEACHER":
      return "/teacher";
    case "ADMIN":
      return "/admin";
    case "STUDENT":
      return "/student";
    default:
      return "/";
  }
}
