import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
// console.log(result.parsed);
console.log(process.env["MONGO_URI"]);
const mySecret = process.env["MONGO_URI"];
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const Todo = mongoose.model("Todo", todoSchema);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// To get the full list of todos
app.get("/api/todos", (req, res) => {
  Todo.find({}, (err, allTodos) => {
    if (err) return console.error(err);
    res.json(allTodos);
  });
});

// get detail of single todo
app.get("/api/todos/:id", (req, res) => {
  const todo = todosData.find((item) => {
    return item._id == req.params.id;
  });
  if (todo) {
    res.json(todo);
  } else {
    res.json({ error: "Not Found" });
  }
});

// to add the new task into the list
app.post("/api/todos", (req, res) => {
  todosData.push(req.body);
  res.json({
    todos: todosData,
  });
});

// to remove the task from the list
app.delete("/api/todos/:id", (req, res) => {
  (todosData = todosData.filter((item) => {
    return item._id == id;
  })),
    res.status(204);
  res.json({});
});

// to change the done status and edit the task
app.put("/api/todos/:id", (req, res) => {
  // change the done status
  const toDoId = req.params.id;
  const todoItem = todosData.find((item) => {
    return item._id == toDoId;
  });
  todosData = todosData.map((item) => {
    if (item._id == toDoId) {
      return {
        ...item,
        todo: req.body.todo,
        done: req.body.done,
      };
    } else {
      return item;
    }
  });

  return {
    ...todoItem,
    todo: req.body.todo,
    done: req.body.done,
  };
});

app.listen(3000, "localhost", () => {
  console.log("listning ...");
});
