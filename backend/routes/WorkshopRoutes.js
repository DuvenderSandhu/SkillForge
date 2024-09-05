import express from  'express'
import Workshop from  '../models/Workshop.js'
import authenticateToken from '../utils/authenicateUser.js';

const WorkshopRouter = express.Router();
// Create a new workshop
WorkshopRouter.post('/',authenticateToken, async (req, res) => {
    if(req.user.role=='learner'){
        res.status(400).json({ error: "You Must be a Teacher or Admin to Create Course" });
    }
    try {
        req.body.instructor=req.user._id
        const workshop = new Workshop(req.body);
        await workshop.save();
        res.status(201).json(workshop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all workshops
WorkshopRouter.get('/', async (req, res) => {
    try {
        const workshops = await Workshop.find();
        res.status(200).json(workshops);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single workshop by ID
WorkshopRouter.get('/:id', async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        res.status(200).json(workshop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a workshop by ID
WorkshopRouter.put('/:id', async (req, res) => {
    try {
        const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        res.status(200).json(workshop);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a workshop by ID
WorkshopRouter.delete('/:id', async (req, res) => {
    try {
        const workshop = await Workshop.findByIdAndDelete(req.params.id);
        if (!workshop) {
            return res.status(404).json({ error: 'Workshop not found' });
        }
        res.status(200).json({ message: 'Workshop deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default WorkshopRouter;
