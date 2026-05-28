import { createBranch } from "./../Repository/branch.repository";
import AppError from "../utils/AppError";

import bcrypt from "bcryptjs";

import {
  findOrganizationProfile,
  findAdminProfile,
} from "../Repository/profile.repository";

import { updateOrganizationProfile } from "../Repository/organization.repository";
import { updateAdminProfile } from "../Repository/admin.repository";
import { updateBranchById } from "../Repository/branch.repository";

export const getProfileDetailsService = async ({
  organizationId,
  userId,
}: {
  organizationId: number;

  userId: number;
}) => {
  const organization = await findOrganizationProfile(organizationId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const admin = await findAdminProfile(userId);

  if (!admin) {
    throw new AppError("Admin not found", 404);
  }

  return {
    organization: {
      id: organization.id,

      companyName: organization.companyName,

      sector: organization.industry,

      branches: organization.branches,
    },

    admin: {
      fullName: admin.name,

      phone: admin.phone,

      email: admin.email,
    },
  };
};

export const updateProfileDetailsService = async ({
  organizationId,
  userId,
  payload,
}: {
  organizationId: number;

  userId: number;

  payload: any;
}) => {
  const { companyName, sector, fullName, phone, branches, password } = payload;
  console.log("updateProfileDetailsService payload:", branches);

  // ORGANIZATION
  const organization = await findOrganizationProfile(organizationId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  // UPDATE ORGANIZATION
  await updateOrganizationProfile(organizationId, {
    companyName,

    industry: sector,
  });

  // UPDATE ADMIN
  const updateData: any = {
    name: fullName,

    phone,
  };

  // PASSWORD UPDATE
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    updateData.password = hashedPassword;
  }

  await updateAdminProfile(userId, updateData);

  // BRANCHES
  if (Array.isArray(branches)) {
    for (const branch of branches) {
      // EXISTING BRANCH
      if (branch.id) {
        await updateBranchById(branch.id, {
          name: branch.name,

          latitude: branch.latitude,

          longitude: branch.longitude,
        });
      }

      // NEW BRANCH
      else {
        await createBranch({
          organizationId,

          name: branch.name,

          latitude: branch.latitude,

          longitude: branch.longitude,

          allowedRadius: 100,
        });
      }
    }
  }

  return {
    success: true,
  };
};
