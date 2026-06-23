import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_APIKEY, 
        api_secret:process.env.CLOUDINARY_APISECRET // Click 'View API Keys' above to copy your API secret
    });
    
     // Upload an image
     const uploadonCloudinary=async(localfilePath)=>{
        try{
        if(!localfilePath) return null;
        const response=await cloudinary.uploader.upload(localfilePath,{
            resource_type:"auto"
        });
        console.log("image upload on cloudinary",response.url);

        fs.unlinkSync(localfilePath) //delete temp file after succesful upload
        return response;

        }
        catch(error){
            fs.unlinkSync(localfilePath);
            return null;
        }
    
     }

     export {uploadonCloudinary}