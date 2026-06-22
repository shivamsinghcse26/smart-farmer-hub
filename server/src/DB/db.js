import dotenv from "dotenv";
dotenv.config(); 
import mongoose from "mongoose"


const connectDB=async()=>{
    try{
        
    const connectionInstance=await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected at",connectionInstance.connection.host)
    }
    catch(error){
        throw new ApiError(500,"somthing went wrong while database is connect",error);
    }


}

export default connectDB;