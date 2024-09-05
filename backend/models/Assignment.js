import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fileUrl: { type: String, required: true },
        submittedAt: { type: Date, default: Date.now },
        grade: { type: Number, min: 0, max: 100 },
        feedback: { type: String },
      },
    ],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
