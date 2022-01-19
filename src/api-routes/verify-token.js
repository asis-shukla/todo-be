import jwt from "jsonwebtoken";

function authVerify(req, res, next) {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ errorMsg: "No token found in header field 'Authorization'" });
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (verified) {
      req.user = verified;
      next();
    }
  } catch (error) {
    return res.status(400).json({ errorMsg: "Invalid Token" });
  }
}

export default authVerify;
