// models/User.js
import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    certifications: [{ type: String }],
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    role: {
      type: String,
      enum: ["learner", "instructor", "admin"],
      default: "learner",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.model("User", userSchema);
