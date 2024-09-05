import { Router } from "express";
import FileHandle from "../middlewares/FileHandle.js";
import sendResponse from "../utils/response.js";

const FileRouter= Router()

FileRouter.post('/',FileHandle,(req,res)=>{
    if(req.file){
        sendResponse(res,200,true,"File Successfully Uploaded",{ok:true})
    }
    else{
        sendResponse(res,400,true,"File Not Received",{ok:false})
    }
})

export default FileRouter