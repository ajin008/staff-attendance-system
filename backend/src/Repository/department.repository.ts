import prisma from "../utils/prisma";

export const createDepartment = async (data: {
  organizationId: number;

  name: string;

  shiftStart: string;

  shiftEnd: string;

  overtimeEnabled: boolean;

  overtimeGraceMins: number;

  overtimeHourlyRate?: number;

  defaultSalary: number;
}) => {
  return prisma.department.create({
    data,
  });
};
