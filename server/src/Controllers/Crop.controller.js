import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { set } from "mongoose";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Crop } from "../Models/Crop.model.js";
import { getCropImage } from "../Utils/cropImages.js";

const AddCrop=AsyncHandler(async(req ,res )=>{
    const farmerId=req?.user._id;

    const {cropName,quantity,pricePerKg,location,availableFrom}=req.body;

    if(!cropName || !quantity || !pricePerKg || !location || !availableFrom ){
        throw new ApiError(403,"field are empty");
    }

const image = getCropImage(cropName);


    const crops = await Crop.create({
    farmerId,
    cropName,
    quantity,
    pricePerKg,
    location,
    availableFrom,
    image
    });

    return res.status(200).json(new ApiResponse(200,crops,"crop add successfully"));

});

    //for updating crop we need crop_id because each individuals farmers have more than one crops,so finding as a specfic crops to update we required a cropsId so we take it from frontend

const UpdateCrop=AsyncHandler(async(req,res)=>{ 
    const {id}=req.params;
    const farmerId=req.user?._id
    if(!farmerId) throw new ApiError(401,"unauthorized access");

    const crop= await Crop.findOne(
        {
            _id : id,
            farmerId
        }
    );

    if(!crop) throw new ApiError(404,"crop not found");

    Object.assign(crop,req.body); //This copies values from req.body into the existing crop object.
    await crop.save(); //This saves the updated document back to MongoDB.


    return res
        .status(200)
        .json(new ApiResponse(200,crop,"crop update successfully"));
})

const DeleteCrop=AsyncHandler(async(req,res)=>{
    const {id}=req.params
    if (!id) {
  throw new ApiError(400, "Crop id is required");
}

    const farmerId=req.user?._id
    if(!farmerId) throw new ApiError(401,"unauthorized access");

    const crop=await Crop.findOneAndDelete({
        _id:id,
        farmerId
    })

    if(!crop) throw new ApiError(404,"crop not found")
    
    return res
            .status(200)
            .json(new ApiResponse(200,{},"crop deleted successfully"));
})


export {AddCrop,
        UpdateCrop,
        DeleteCrop
        }
