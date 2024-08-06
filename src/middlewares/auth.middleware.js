const authMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401); // Unauthorized
  }
  return next();
};

export default authMiddleware;
