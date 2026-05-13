import HttpError from "./HttpError.js";

const checkRole =
  (...role) =>
  async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new HttpError("Unauthorized User", 401));
      }

      if (!role.includes(req.user.role)) {
        return next(new HttpError("Access Denied...!", 403));
      }

      next();
    } catch (error) {
      next(new HttpError(error.message, 500));
    }
  };

export default checkRole;
