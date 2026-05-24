import { findBranchesByOrganizationId } from "../Repository/branch.repository";

export const getAllBranchesService = async (organizationId: number) => {
  return await findBranchesByOrganizationId(organizationId);
};
