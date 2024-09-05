import mongoose from "mongoose";


const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [
          {
            optionText: { type: String, required: true },
            isCorrect: { type: Boolean, default: false },
          },
        ],
      },
    ],
    duration: { type: Number, required: true }, // in minutes
    attemptsAllowed: { type: Number, default: 1 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
