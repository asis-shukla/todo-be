import express from "express";
const app = express();
const todosData = [
  {
    todo: "Read the book",
    _id: 1,
  },
  {
    todo: "Call Someone",
    _id: 2,
  },
  {
    todo: "Complete the T",
    _id: 3,
  },
];
app.get("/", (req, res) => {
  res.send("root path response");
});

app.get("/api/todos", (req, res) => {
  res.json({
    todos: todosData,
  });
});

app.listen(3000, "localhost", () => {
  console.log("listning ...");
});
