import mongoose from 'mongoose'

const buyerSchema=new mongoose.Schema({
    
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crop",
      },
    ],
City: String,
State: String,
Pincode: String,
preferredCrops: { type: [String], default: [] }

  
   
},
{timestamps:true}
);

export const Buyer=mongoose.model("Buyer",buyerSchema)