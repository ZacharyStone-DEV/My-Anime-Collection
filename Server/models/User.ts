// Import the necessary libraries
import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the User schema
const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
      unique: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      select: false,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    language: {
      type: String,
      enum: ["en", "jp"],
      default: "en",
    },
  },
  { timestamps: true }
);

// Hash the password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Compare the entered password with the hashed password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// Create a TTL index on the createdAt field for demo users with a expireAfterSeconds option (in this case, 30 days)
UserSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 30 * 24 * 60 * 60,
    partialFilterExpression: { isDemo: true },
  }
);

// Create a document interface for the user
export interface UserDocument extends Document {
  name: string;
  email: string;
  isDemo: boolean;
  password: string;
  theme: "light" | "dark";
  language: "en" | "jp";
  createJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create and export the User model
const User = mongoose.model<UserDocument>("User", UserSchema);
export default User;
