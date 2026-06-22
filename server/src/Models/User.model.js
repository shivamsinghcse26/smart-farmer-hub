import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from "crypto";

const UserSchema=new mongoose.Schema({
  Name: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    minlength: 2
  },

  PhoneNo: {
    type: String,
    required: true,
    unique: true,
    match: [/^[0-9]{10}$/, "Phone number must be 10 digits"]
  },

  EmailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },

  Password: {
    type: String,
    required: true,
    minlength: 6
  },
  Address:{
    type:String,
    required:true,
  },

  Avatar: {
    type: String
  },

  AccessToken: {
    type: String
  },

  RefreshToken: {
    type: String
  },

  Role: {
    type: String,
    enum: ["farmer", "buyer","admin"],
    default: "farmer",
    required: true
  },
  
  isBlocked: {
  type: Boolean,
  default: false,
},
// User.model.js (add these fields)
ResetPasswordToken: {
  type: String,
},
ResetPasswordExpire: {
  type: Date,
},

},
{ timestamps: true }
);


UserSchema.pre("save", async function () {
  if (!this.isModified("Password")) return;

  this.Password = await bcrypt.hash(this.Password, 10);
});



UserSchema.methods.isPasswordCorrect=async function(Password){
    return await bcrypt.compare(Password,this.Password);
}

UserSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id:this._id,
            EmailId:this.EmailId,
            PhoneNo:this.PhoneNo,
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id:this._id,
            PhoneNo:this.PhoneNo
        },
        process.env.REFRESH_TOKEN,
        {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // ✅ store hashed token in DB
  this.ResetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // ✅ token valid for 10 minutes
  this.ResetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken; // send raw token to user
};



export const User=mongoose.model("User",UserSchema);