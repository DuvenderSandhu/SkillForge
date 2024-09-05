import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workshop", workshopSchema);
