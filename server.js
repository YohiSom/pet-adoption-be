import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";

//db authenticateUser
import connectionDB from "./db/connect.js";

//routers
import authRoutes from "./routes/authRoutes.js";
import petsRoutes from "./routes/petsRoutes.js";

//middleware

import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import authenticateUser from "./middleware/auth.js";

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? "https://pet-kingdom-app.herokuapp.com" : "http://localhost:3000",
  credentials: true,
}));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
// app.use(`/${process.env.UPLOAD_FOLDER}`, express.static(process.env.UPLOAD_FOLDER))

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/pets", petsRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectionDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
