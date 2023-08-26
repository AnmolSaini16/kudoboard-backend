import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).send({ error: "You are not authenticated!" });
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return res.status(404).send({ error: "Unauthorised" });
    req.user = user;
    next();
  });
};
