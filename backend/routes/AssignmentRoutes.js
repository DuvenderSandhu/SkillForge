import express from 'express'
const AssignmentRouter = express.Router();
import Assignment from '../models/Assignment.js'
import fs from 'fs'
import path from 'path'
import authenticateToken from '../utils/authenicateUser.js';
import UploadFile from '../utils/uploadFile.js';
import FileHandle from '../middlewares/FileHandle.js';

// Create a new assignment
AssignmentRouter.post('/',authenticateToken, async (req, res) => {
    if(req.user.role=='learner'){
        res.status(400).json({ error: "You Must be a Teacher or Admin to Create Course" });
    }
    try {
        req.body.instructor=req.user._id
        const assignment = new Assignment(req.body);
        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all assignments
AssignmentRouter.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a single assignment by ID
AssignmentRouter.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.status(200).json(assignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update an assignment by ID
AssignmentRouter.put('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.status(200).json(assignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an assignment by ID
AssignmentRouter.delete('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//  Submit Assignement
AssignmentRouter.post('/submit/:assignmentID/', authenticateToken, FileHandle, async (req, res) => {
    try {
        // Check if a file is uploaded
        console.log(req.file)
        if (!req.file) {
            console.log("HI 2")
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(req.body);

        const oldFilePath = path.join( 'uploads', req.file.filename); // Original path
        const newFilePath = path.join( 'uploads', `${req.params.assignmentID}-${req.user._id}.pdf`); // New path with renamed file
        
        // Rename the file
        fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
                return res.status(500).send('Error renaming file.');
            }
        });

        // Find the assignment by ID
        const assignment = await Assignment.findById(req.params.assignmentID);
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        // Update assignment submissions
        const { submittedAt, feedback } = req.body;
        const submission = {
            student: req.user._id,
            fileUrl: newFilePath,
            submittedAt,
            feedback
        };

        assignment.submissions.push(submission);
        await assignment.save();

        res.status(200).json({ message: 'Assignment submitted successfully' });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(400).json({ error: error.message });
    }
});

export default AssignmentRouter;
