import { findOrganizationById } from "../Repository/organization.repository";
import { countOrganizationStaff } from "../Repository/user.repository";

export const generateStaffId = async (
  organizationId: number,
  joinedOn: Date
): Promise<string> => {
  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new Error("Organization not found");
  }

  const prefix = organization.companyName
    .replace(/[^A-Za-z]/g, "")
    .substring(0, 3)
    .toUpperCase();

  const staffCount = await countOrganizationStaff(organizationId);

  const sequence = String(staffCount + 1).padStart(4, "0");

  const year = joinedOn.getFullYear().toString().slice(-2);

  return `${prefix}-${year}${sequence}`;
};
