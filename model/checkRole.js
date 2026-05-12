import HttpError from "../middleware/HttpError.js";

const checkRole =
  (...role) =>
  async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new HttpError("UnAuthorization", 401));
      }

      if (!role.includes(req.user.role)) {
        return next(new HttpError("Access Denied...!"));
      }

      next();
    } catch (error) {
      next(new HttpError(error.message, 500));
    }
  };

export default checkRole;
