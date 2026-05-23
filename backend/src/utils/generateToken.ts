import jwt from "jsonwebtoken";

const generateToken = (
  userId: number,
  organizationId: number,
  role: string
): string => {
  return jwt.sign(
    {
      userId,
      organizationId,
      role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;
