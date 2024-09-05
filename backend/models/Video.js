import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true,
    },
    tags: [{
        type: String,
    }],
    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        comment: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
},{timestamps:true});
const Video= mongoose.model('Video', videoSchema);
export default Video
