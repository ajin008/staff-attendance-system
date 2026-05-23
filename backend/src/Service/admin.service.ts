import {
  countDepartmentByOrganization,
  countStaffByOrganization,
} from "../Repository/admin.repository";

export const adminStatusService = async (
  userId: number,
  organizationId: number
) => {
  const totalStaff = await countStaffByOrganization(organizationId);

  const totalDepartments = await countDepartmentByOrganization(organizationId);

  // dummy value for now
  const pendingLeave = 5;

  return {
    totalStaff,

    totalDepartments,

    pendingLeave,
  };
};
