import { upload } from "../server.js";
import sendResponse from "../utils/response.js";

async function FileHandle(req, res, next) {
    upload.single('file')(req, res, function (err) {
        if (err) {
            // Handle the error here
            return sendResponse(res, 500, false, "Something went wrong in Multer File Handling", err);
        }
        // If no error, proceed to the next middleware
        console.log("File DOne")
        next();
    });
}

export default FileHandle