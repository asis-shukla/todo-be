import mongoose from "mongoose";

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
export default Todo;
