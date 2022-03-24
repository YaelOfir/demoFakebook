export const requireAuth = (req, res, next) => {
  if (!req.user) {
    throw new Error("Not Autherized");
  }

  next();
};
