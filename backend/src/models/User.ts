import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  staffId: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff";
  joinedOn: string;
  comparePassword: (password: string) => Promise<Boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    staffId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], default: "staff" },
    joinedOn: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
