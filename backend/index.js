import express from "express";
import mongoose from "mongoose";
import bookRoute from "./routes/booksRoute.js";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not defined
const dbURL = process.env.mongoDB_URL;

// Middleware
app.use(express.json());
app.use(cors());

// Root route
app.get("/", (req, res) => {
    return res.status(200).send("Welcome to the Book API!");
});

// Books route
app.use("/books", bookRoute);

// Database connection
mongoose
    .connect(`${dbURL}/books`, )
    .then(() => {
        console.log("Connected to the database");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err.message);
      
    });
