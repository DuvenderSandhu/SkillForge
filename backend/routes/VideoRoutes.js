import express from 'express'
import Video from '../models/Video.js'
import User from '../models/User.js'
import authenticateToken from '../utils/authenicateUser.js'
import FileHandle from '../middlewares/FileHandle.js'
import sendResponse from '../utils/response.js'
import UploadFile from '../utils/uploadFile.js'
const VideoRouter= express.Router()
import fs from 'fs'
import mongoose from 'mongoose'
VideoRouter.post('/create',authenticateToken,FileHandle,async (req,res)=>{
    try {
        let result= await UploadFile(req.file.path)
        if(result.url && result.secure_url){
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
            });
        }
        const { title, description, course } = req.body;
        const videoUrl = result.secure_url;
        console.log(course)

        const video = await Video.create({
            title,
            description,
            videoUrl,
            course:new mongoose.Types.ObjectId(course),
            instructor: new mongoose.Types.ObjectId(req.user._id),
        });

        sendResponse(res, 201, true, "Video uploaded successfully", video);
    } catch (error) {
        console.log(error)
        sendResponse(res, 500, false, "Failed to upload video", error);
    }
   
})
VideoRouter.get('/:courseID',authenticateToken,async (req,res)=>{
    try {
        const video = await Video.find({course:new mongoose.Types.ObjectId(req.params.courseID)});
        const curentuser = await User.findById(req.user._id)
        console.log(video)
        if(!curentuser.enrolledCourses?.includes(req.params.courseID)){
        return sendResponse(res, 400, false, "Unauthorized Data Requested",{});
            
        }
        sendResponse(res, 201, true, "Video Fetched", video);


    } catch (error) {
        console.log(error)
        sendResponse(res, 500, false, "Failed to upload video", error);
    }
   
})


export default VideoRouter