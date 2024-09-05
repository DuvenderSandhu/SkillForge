import express from "express"
import Quiz from '../models/Quiz.js'
import authenticateToken from "../utils/authenicateUser.js";
const QuizRoutes = express.Router();

// Create a new quiz
QuizRoutes.post('/',authenticateToken, async (req, res) => {
    if(req.user.role=='learner'){
        res.status(400).json({ error: "You Must be a Teacher or Admin to Create Course" });
    }
    try {
        req.body.instructor=req.user._id
        const quiz = new Quiz(req.body);
        await quiz.save();
        res.status(201).json(quiz);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all quizs
QuizRoutes.get('/', async (req, res) => {
    try {
        const quiz = await Quiz.find();
        res.status(200).json(quiz);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single quiz by ID
QuizRoutes.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update an quiz by ID
QuizRoutes.put('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an quiz by ID
QuizRoutes.delete('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default QuizRoutes;
