import mongoose from "mongoose";


const forumPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ForumPost", forumPostSchema);
