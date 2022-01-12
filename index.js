import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import lodash from "lodash";
import bcrypt from "bcryptjs";

dotenv.config();

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

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);
const User = mongoose.model("User", userSchema);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Home page of todo be");
});

app.get("/api", (req, res) => {
  res.send("API page of todo be");
});

app.post("/api/users", (req, MainRes) => {
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

app.get("/api/users/login", (req, res) => {
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
        res.status(401)
        res.json({
          errorMsg: "Email or password is inccorrect",
          _error: "Unauthorized",
        });
      }
    }
  });
});

// To get the full list of todos
app.get("/api/todos", (req, res) => {
  Todo.find({}, (err, allTodos) => {
    if (err) return console.error(err);
    res.json(allTodos);
  });
});

// get detail of single todo
app.get("/api/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (todo) {
    res.json(todo);
  } else {
    res.json({ error: "Not Found" });
  }
});

// to add a new task into the list
app.post("/api/todos", async (req, res) => {
  const postTodoData = req.body;
  Todo.create(postTodoData, (err, newTodo) => {
    if (err) return console.error(err);
    res.status(201);
    res.json(newTodo);
  });
});

// to remove the task from the list
app.delete("/api/todos/:id", (req, res) => {
  Todo.findByIdAndDelete(req.params.id, (req, deleteRes) => {
    res.status(204);
    res.json(deleteRes);
  });
});

// to delete all todos
app.delete("/api/todos", (req, res) => {
  Todo.deleteMany({}, (req, deleteRes) => {
    res.json(deleteRes);
  });
});

// to change the done status and edit the task
app.put("/api/todos/:id", (req, res) => {
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

app.listen(3000, "localhost", () => {
  console.log("listning ...");
});
