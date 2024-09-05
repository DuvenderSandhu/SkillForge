import { v2 as cloudinary } from 'cloudinary';

async function UploadFile(filePath) {
    // Configuration
    cloudinary.config({ 
        cloud_name:"dd5wmub9z", 
        api_key: "782689587934652", 
        api_secret: "8LfY3gh8MM6xODmTybWxg__J5cw"
    
    });
    
     const uploadResult = await cloudinary.uploader
       .upload(
           filePath,
           {
            resource_type: 'video',
            folder:"skillforge"
           } 
       )
       .catch((error) => {
           console.log(error);
       });
    
    return uploadResult;
    
       
}

export default UploadFile