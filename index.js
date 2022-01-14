import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import indexApiRouter from "./src/api-routes/index.js";

dotenv.config();

const mySecret = process.env["MONGO_URI"];
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Home page of todo be");
});

app.use("/api", indexApiRouter);

app.listen(3000, "localhost", () => {
  console.log("listning ...");
});
