import crypto from "crypto";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { User } from "../Models/User.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import dotenv from "dotenv";
dotenv.config();

/* =========================================================
   BREVO EMAIL CLIENT (API — NOT SMTP)
========================================================= */
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/* =========================================================
   FORGOT PASSWORD
========================================================= */
const forgotPassword = AsyncHandler(async (req, res) => {
  const { EmailId } = req.body;

  if (!EmailId) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    EmailId: EmailId.toLowerCase().trim(),
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //  Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // Reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
Hello ${user.Name},

You requested to reset your KishanSetu account password.

Reset your password using the link below:
${resetUrl}

This link will expire in 10 minutes.

If you did not request this, please ignore this email.

— KishanSetu Support Team
`;

  try {
    await emailApi.sendTransacEmail({
      sender: {
        email: "kishansetu.care@gmail.com",
        name: "KishanSetu Support",
      },
      to: [{ email: user.EmailId }],
      subject: "Reset Your Password - KishanSetu",
      textContent: message,
    });

    return res.status(200).json(
      new ApiResponse(200, {}, "Reset password link sent to email ✅")
    );
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    user.ResetPasswordToken = undefined;
    user.ResetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Email sending failed");
  }
});

/* =========================================================
   RESET PASSWORD
========================================================= */
const resetPassword = AsyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    throw new ApiError(400, "Both password fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    ResetPasswordToken: hashedToken,
    ResetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.Password = newPassword;
  user.ResetPasswordToken = undefined;
  user.ResetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, {}, "Password reset successful ✅")
  );
});

/* =========================================================
   GET CURRENT USER
========================================================= */
const getCurrentUser = AsyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: req.user._id,
        Role: req.user.Role,
        Name: req.user.Name,
        EmailId: req.user.EmailId,
        PhoneNo: req.user.PhoneNo,
        Address: req.user.Address,
      },
      "Current user fetched successfully ✅"
    )
  );
});

export { forgotPassword, resetPassword, getCurrentUser };
