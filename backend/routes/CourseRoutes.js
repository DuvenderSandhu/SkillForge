import express from "express"
import Course from '../models/Course.js'
import User from "../models/User.js";
import authenticateToken from '../utils/authenicateUser.js'
import mongoose from 'mongoose'
import Video from "../models/Video.js";
import sendResponse from "../utils/response.js";
const CourseRouter = express.Router();

// Create a new course
CourseRouter.post('/', authenticateToken,async (req, res) => {
    try {
        console.log("User Here")
        console.log(req.user)
        if(!req.user){
            res.status(400).json({ error: "Invalid Login" });
        }
      
        if(req.user.role=='learner'){
            res.status(400).json({ error: "You Must be a Teacher or Admin to Create Course" });
        }
        try{
            req.body.instructor=req.user._id
            const course = new Course(req.body);
            await course.save();

            res.status(201).json(course);
        }
        catch(e){
            res.status(400).json({ error: "Something Went Wrong" ,e});


        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Get all courses
CourseRouter.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Get A  courses
CourseRouter.get('/course/:id', async (req, res) => {
    try {
        const courses = await Course.findById(new mongoose.Types.ObjectId(req.params.id));
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




CourseRouter.get('/teacher', authenticateToken, async (req, res) => {
    console.log("Teacher here")
    try {
        const userId = req.user._id;

        // Convert userId to ObjectId
        const instructorId = new mongoose.Types.ObjectId(userId);
        console.log(instructorId)
        const courses = await Course.find({ instructor: instructorId });

        if (courses.length === 0) {
            return sendResponse(res, 404, false, "Course Not Found", { error: "No courses found for this teacher" });
        }

        return sendResponse(res, 200, true, "Courses Found", courses);
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, false, "Something Went Wrong", { error: error.message });
    }
});


// Update a course by ID
CourseRouter.put('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a course by ID
CourseRouter.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

CourseRouter.get('/enrolled',authenticateToken, async (req, res) => {
    try {
        console.log(req.user)
        const course = await Course.find({students:req.user._id}).select("_id");
        if (course.length==0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const courses = course.map(item => item._id);
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    })
// Enroll User in a course 
CourseRouter.post('/enroll/:id', authenticateToken, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            console.log("Course Not Found")
            return res.status(404).json({ error: 'Course not found' });
        }

        // Increment the enrollment count
        if (!course.students.includes(req.user._id)) {
            course.enrollmentCount = course.enrollmentCount + 1;
            course.students.push(req.user._id);

            let userData = await User.findById(req.user._id);
            userData.enrolledCourses.push(new mongoose.Types.ObjectId(req.params.id));  // Corrected line
            await userData.save();
            await course.save();

            return res.status(200).json({ message: 'User Enrolled in Course' });
        } else {
            console.log("Exists")
            return res.status(400).json({ error: 'User already enrolled in the course' });
        }

    } catch (error) {
        console.log("Error", error)
        res.status(400).json({ error: error.message });
    }
});


// Get Teacher Courses
CourseRouter.get('/user/:userid', async (req, res) => {
    try {
        console.log('hi')
        const course = await Course.find({instructor:new mongoose.Types.ObjectId(req.params.userid)});
        if (course.length==0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});








export default CourseRouter;
