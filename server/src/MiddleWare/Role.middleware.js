import { ApiError } from "../Utils/ApiError.js";

export const requireRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user?.Role || req.user?.role;
    if (userRole !== role) {
      throw new ApiError(403, `${role} access only`);
    }
    next();
  };
};
