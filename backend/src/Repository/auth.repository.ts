import { IUser } from "./../models/User";
import User from "../models/User";

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

export const findUserByStaffId = async (
  staffId: string
): Promise<IUser | null> => {
  return User.findOne({ staffId });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id).select("-password");
};

export const createUser = async (data: {
  staffId: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff";
  joinedOn: string;
  phone?: string;
}): Promise<IUser> => {
  return User.create(data);
};

export const countStaff = async (): Promise<number> => {
  return User.countDocuments({ role: "staff" });
};

export const findAllStaff = async (
  page: number,
  limit: number,
  search: string
): Promise<{ staff: IUser[]; total: number }> => {
  const matchQuery = search
    ? {
        role: "staff",
        $or: [
          { name: { $regex: search, $options: "i" } },
          { staffId: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : { role: "staff" };

  const result = await User.aggregate([
    // filter first
    { $match: matchQuery },

    //remove password
    { $project: { password: 0 } },

    // run two things simultaneously
    {
      $facet: {
        // get paginated staff
        staff: [
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        //  count total
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const staff = result[0].staff;
  const total = result[0].totalCount[0]?.count || 0;

  return { staff, total };
};

export const deleteUserByStaffId = async (staffId: string): Promise<void> => {
  await User.findOneAndDelete({ staffId });
};

export const findAdminExists = async (): Promise<boolean> => {
  const admin = await User.findOne({ role: "admin" });
  return !!admin;
};

export const updateStaffById = async (
  staffId: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    phone: string;
  }>
): Promise<IUser | null> => {
  return User.findOneAndUpdate(
    { staffId },
    { $set: data },
    { new: true }
  ).select("-password");
};
