import "../.././common/env";
const jwt = require("jsonwebtoken");

export default function jwtTokenAuth(err, req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

export const middleWare = (requiredRole) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userRole = decoded.role;
      if (requiredRole.includes(userRole)) {
        next();
      } else {
        return res.status(403).send({
          status: false,
          message: "You do not have permission to perform this action.",
        });
      }
    }else{
      return res.status(401).send({status:false,message:'please provide token'})
    }
  };
}
