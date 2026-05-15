import { findUserByStaffId } from "../Repository/auth.repository";

const generateRandom = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "ST-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateStaffId = async (): Promise<string> => {
  let staffId = generateRandom();
  let exists = await findUserByStaffId(staffId);

  while (exists) {
    staffId = generateRandom();
    exists = await findUserByStaffId(staffId);
  }

  return staffId;
};
