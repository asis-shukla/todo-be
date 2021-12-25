import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("root path response");
});

app.get("/api/todos", (req, res) => {
  res.json({
    todos: [1, 2, 3],
  });
});

app.listen(3000, "localhost", () => {
  console.log("listning ...");
});
