import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import './config/passportConfig.js';
import cors from "cors";
import { router } from "./routes/userRoutes.js";
import * as dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();

const app = express();
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PATCH","DELETE"],
    credentials: true,
  })
);

app.use(passport.initialize());

app.use("/", router);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
