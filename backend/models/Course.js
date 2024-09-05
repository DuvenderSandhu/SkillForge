import mongoose from "mongoose";


const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modules: [
      {
        title: { type: String },
        content: { type: String },
        type: {
          type: String,
          enum: ["video", "text", "quiz"],
          default: "text",
        },
      },
    ],
    pricing: {
      type: {
        type: String,
        enum: ["free", "one-time", "subscription"],
        default: "free",
      },
      amount: { type: Number },
    },
    enrollmentCount: { type: Number, default: 0 },
    students:{type:Array,default:[]},
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
    ],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
