import express from "express";
import bcrypt from "bcryptjs";
import User, {
  newUserValidation,
  userLoginValidation,
} from "../models/user-model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, MainRes) => {
  const postedUserData = req.body;
  const { error } = newUserValidation(postedUserData);
  if (error) {
    return MainRes.status(400).json({ errorMsg: error.details[0].message });
  }
  const hash = bcrypt.hashSync(req.body.password);
  try {
    const userAlreadyExist = await User.exists({ email: req.body.email });
    if (userAlreadyExist) {
      return MainRes.status(409).json({ errorMsg: "User already exist" });
    } else {
      const newAddedUser = await User.create({
        ...postedUserData,
        password: hash,
      });
      return MainRes.status(201).json(newAddedUser);
    }
  } catch (error) {
    MainRes.status(500).json(error);
  }
});

router.get("/login", async (req, res) => {
  const { error } = userLoginValidation(req.body);
  if (error) {
    return res.status(400).json({ errorMsg: error.details[0].message });
  }
  try {
    const savedUserData = await User.findOne({ email: req.body.email });
    if (!savedUserData) {
      return res.status(404).json({ errorMsg: "User not found" });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      savedUserData.password
    );
    if (isValidPass) {
      const userData = {
        fullname: savedUserData.fullname,
        email: savedUserData.email,
        _id : savedUserData._id,
      };
      const tokenSecret = process.env.TOKEN_SECRET;
      const token = jwt.sign(userData, tokenSecret);
      res.header("auth-token", token).status(200).json({ ...userData, token: token });
    } else {
      res.status(401).json({ errorMsg: "Email or password is incorrect" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
