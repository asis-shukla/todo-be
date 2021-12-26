import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const todosData = [
  {
    todo: "Read the book",
    done: false,
    _id: 1,
  },
  {
    todo: "Call Someone",
    done: false,
    _id: 2,
  },
  {
    todo: "Complete the T",
    done: false,
    _id: 3,
  },
];
app.get("/", (req, res) => {
  res.send("root path response");
});

// To get the full list of todos
app.get("/api/todos", (req, res) => {
  res.json({
    todos: todosData,
  });
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
