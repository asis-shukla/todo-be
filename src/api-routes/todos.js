import express from "express";
const router = express.Router();
import Todo from "../models/todo-model.js";
import errorTypes from "./errorTypes.js";
import { errorResponse } from "./users.js";
import authVerify from "./verify-token.js";

// To get the full list of todos
router.get("/", authVerify, async (req, res) => {
  try {
    const allTodos = await Todo.find({ userId: req.user._id });
    res.json(allTodos);
  } catch (error) {
    console.error(error);
    res.json(errorResponse(errorTypes.INTERNAL_SERVER_ERROR, error, 500));
  }
});

// get detail of single todo
router.get("/:id", authVerify, async (req, res) => {
  const todo = await Todo.find({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (todo) {
    res.json(todo);
  } else {
    res.json({ error: "Not Found" });
  }
});

// to add a new task into the list
router.post("/", authVerify, async (req, res) => {
  const postTodoData = { ...req.body, userId: req.user._id };
  Todo.create(postTodoData, (err, newTodo) => {
    if (err) return console.error(err);
    res.status(201);
    res.json(newTodo);
  });
});

// to remove the task from the list
router.delete("/:id", authVerify, async (req, res) => {
  try {
    const deleteResponse = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    res.status(204).json(deleteResponse);
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(errorTypes.INTERNAL_SERVER_ERROR, error, 500));
  }
});

// to delete all todos
router.delete("/", authVerify, async (req, res) => {
  Todo.deleteMany({ userId: req.user._id }, (error, deleteRes) => {
    if (error) {
      res
        .status(500)
        .json(errorResponse(errorTypes.INTERNAL_SERVER_ERROR, error, 500));
    }
    res.json(deleteRes);
  });
});

// to change the done status and edit the task
router.put("/:id", authVerify, (req, Mainres) => {
  const update = {
    todo: req.body.todo,
    done: req.body.done,
    userId: req.user._id,
  };
  const options = {
    new: true,
  };
  const filterObj = {
    _id: req.params.id,
    userId: req.user._id,
  };
  Todo.findOneAndUpdate(filterObj, update, options, (err, doc, res) => {
    if (err) return console.error(err);
    Mainres.status(200).json(doc);
  });
});

export default router;
