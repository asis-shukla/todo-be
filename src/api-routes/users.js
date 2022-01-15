import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import User, {
  newUserValidation,
  userLoginValidation,
} from "../models/user-model.js";

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
      MainRes.status(409).json({ errorMsg: "User already exist" });
    } else {
      const newAddedUser = await User.create({
        ...postedUserData,
        password: hash,
      });
      MainRes.status(201).json(newAddedUser);
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
    if (bcrypt.compareSync(req.body.password, savedUserData.password)) {
      res
        .status(200)
        .json({ ...savedUserData._doc, password: null, token: "dasd" });
    } else {
      res.status(401).json({ errorMsg: "Email or password is incorrect" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
