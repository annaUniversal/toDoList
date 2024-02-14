const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authorization invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWY_SECRET);
    // attach user to the job rout
    req.user = { userId: payload.userId, name: payload.name };

    // can be used the following
    // const user = User.findById(payload.id).select('-password')
    // req.user = user

    next()
  } catch (error) {
    throw new UnauthenticatedError("Authorization invalid");
  }
};

module.exports = auth