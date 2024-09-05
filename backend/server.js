import "dotenv/config"
import express from "express"
import cors from "cors"
import multer from 'multer'
import connectToMongo from "./db/connectToMongo.js"
import UserRouter from "./routes/userRoutes.js"
import CourseRouter from "./routes/courseRoutes.js"
import WorkshopRouter from "./routes/workshopRoutes.js"
import AssignmentRouter from "./routes/AssignmentRoutes.js"
import QuizRoutes from "./routes/QuizRoutes.js"
import FileRouter from "./routes/FileRoutes.js"
import VideoRouter from "./routes/VideoRoutes.js"
export const upload = multer({ dest: 'uploads/',limits: { fileSize: 500 * 1024 * 1024 } })
const app = express();
connectToMongo();
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin:"*"
}))
// const routes = require("./routes"); // Assuming you have an index.js in the routes folder that exports all your routes
// app.use("/api", routes);
app.use('/api/user/', UserRouter); 
app.use('/api/courses', CourseRouter);
app.use('/api/workshops', WorkshopRouter);
app.use('/api/assignments', AssignmentRouter);
app.use('/api/quizzes', QuizRoutes);
app.use('/api/videos', VideoRouter);
app.use('/api/upload/',FileRouter)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
