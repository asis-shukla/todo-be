import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import User from "../models/user-model.js";

router.post("/", (req, MainRes) => {
  const postedUserData = req.body;
  const hash = bcrypt.hashSync(req.body.password);
  User.exists({ email: req.body.email }, (req, userAlreadyExist) => {
    if (userAlreadyExist) {
      MainRes.status(409);
      MainRes.json({
        errorMsg: "User already exist",
        _error: userAlreadyExist,
      });
    } else {
      User.create({ ...postedUserData, password: hash }, (err, newUser) => {
        if (err) {
          MainRes.status(500);
          MainRes.json({
            errorMsg: "some error during Create",
            _error: err,
          });
        }
        MainRes.status(201);
        MainRes.json(newUser);
      });
    }
  });
});

router.get("/login", (req, res) => {
  const userDetails = {
    email: req.body.email,
  };
  User.findOne(userDetails, (err, savedUserData) => {
    if (err || !savedUserData) {
      res.json({
        errorMsg: "Email or password is inccorrect",
        _error: "Unauthorized",
      });
    } else {
      if (bcrypt.compareSync(req.body.password, savedUserData.password)) {
        const cud = {
          ...savedUserData._doc,
          password: null,
          token: "dfsffasdasfaf",
        };
        res.json(cud);
      } else {
        res.status(401);
        res.json({
          errorMsg: "Email or password is inccorrect",
          _error: "Unauthorized",
        });
      }
    }
  });
});

export default router;
