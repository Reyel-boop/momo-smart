"use server";

import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

type Fail = { ok: false; error: string };
const fail = (error: unknown, fallback: string): Fail => ({
  ok: false,
  error: error instanceof Error ? error.message : fallback,
});

export type NewPerson =
  | {
      role: "STUDENT";
      name: string;
      email: string;
      studentNumber: string;
      gradeLevel: number;
    }
  | {
      role: "TEACHER";
      name: string;
      email: string;
      title?: string;
      employeeNumber: string;
      departmentId?: string;
    };

export async function addPerson(
  input: NewPerson,
): Promise<{ ok: true; password: string } | Fail> {
  try {
    const { password } = await api.admin.addPerson(input);
    revalidatePath("/admin", "layout");
    return { ok: true, password };
  } catch (error) {
    return fail(error, "The account was not created.");
  }
}

export type ImportRow = {
  name: string;
  email: string;
  studentNumber: string;
  gradeLevel: number;
  sectionId?: string;
};

export async function importStudents(rows: ImportRow[]) {
  try {
    const results = await api.admin.importStudents({ rows });
    revalidatePath("/admin", "layout");
    return { ok: true as const, results };
  } catch (error) {
    return fail(error, "The import failed.");
  }
}

export async function resetPassword(
  userId: string,
): Promise<{ ok: true; password: string } | Fail> {
  try {
    const { password } = await api.admin.resetPassword({ userId });
    revalidatePath("/admin/people");
    return { ok: true, password };
  } catch (error) {
    return fail(error, "The password was not reset.");
  }
}

export async function setActive(userId: string, active: boolean) {
  try {
    await api.admin.setActive({ userId, active });
    revalidatePath("/admin", "layout");
    return { ok: true as const };
  } catch (error) {
    return fail(error, "Nothing was changed.");
  }
}

export async function createClass(input: {
  courseId: string;
  teacherId: string;
  code: string;
  period: number;
  room: string;
}): Promise<{ ok: true; sectionId: string } | Fail> {
  try {
    const { sectionId } = await api.admin.createClass(input);
    revalidatePath("/admin", "layout");
    revalidatePath("/teacher", "layout");
    return { ok: true, sectionId };
  } catch (error) {
    return fail(error, "The class was not created.");
  }
}

export async function enrollStudents(sectionId: string, studentIds: string[]) {
  try {
    await api.admin.enroll({ sectionId, studentIds });
    revalidatePath("/admin", "layout");
    return { ok: true as const };
  } catch (error) {
    return fail(error, "Nobody was enrolled.");
  }
}

export async function unenrollStudent(sectionId: string, studentId: string) {
  try {
    await api.admin.unenroll({ sectionId, studentId });
    revalidatePath("/admin", "layout");
    return { ok: true as const };
  } catch (error) {
    return fail(error, "The student was not removed.");
  }
}
