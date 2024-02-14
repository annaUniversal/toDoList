const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  try {
    // check header
    console.log('request ==>', req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthenticatedError(
        "Authorization header missing or malformed"
      );
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach user to the request object
    req.user = { userId: payload.userId, name: payload.name };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Token is invalid
      throw new UnauthenticatedError("Invalid token");
    } else if (error instanceof jwt.TokenExpiredError) {
      // Token has expired
      throw new UnauthenticatedError("Token expired");
    } else {
      // Other errors
      console.error(error);
      throw new UnauthenticatedError("Authorization error");
    }
  }
};

module.exports = auth;
