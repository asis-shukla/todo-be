import express from "express";
const router = express.Router();
import Todo from "../models/todo-model.js";
import authVerify from "./verify-token.js";

// To get the full list of todos
router.get("/", authVerify, (req, res) => {
  console.log("current logged in user", req.user);
  Todo.find({}, (err, allTodos) => {
    if (err) return console.error(err);
    res.json(allTodos);
  });
});

// get detail of single todo
router.get("/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (todo) {
    res.json(todo);
  } else {
    res.json({ error: "Not Found" });
  }
});

// to add a new task into the list
router.post("/", async (req, res) => {
  const postTodoData = req.body;
  Todo.create(postTodoData, (err, newTodo) => {
    if (err) return console.error(err);
    res.status(201);
    res.json(newTodo);
  });
});

// to remove the task from the list
router.delete("/:id", (req, res) => {
  Todo.findByIdAndDelete(req.params.id, (req, deleteRes) => {
    res.status(204);
    res.json(deleteRes);
  });
});

// to delete all todos
router.delete("/", (req, res) => {
  Todo.deleteMany({}, (req, deleteRes) => {
    res.json(deleteRes);
  });
});

// to change the done status and edit the task
router.put("/:id", (req, res) => {
  const toDoId = req.params.id;
  const update = {
    todo: req.body.todo,
    done: req.body.done,
  };
  const options = {
    new: true,
  };
  Todo.findByIdAndUpdate(toDoId, update, options, (err, newTodo) => {
    if (err) return console.error(err);
    res.json(newTodo);
  });
});

export default router;
