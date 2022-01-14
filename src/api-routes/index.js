import express from "express";
const router = express.Router();

import usersApiRouter from "./users.js";
import todosApiRouter from "./todos.js";

router.use("/users", usersApiRouter);
router.use("/todos", todosApiRouter);

export default router;
