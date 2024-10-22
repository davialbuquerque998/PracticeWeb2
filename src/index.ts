import {connectMongo, findCustomers} from "./config/db";
import express, {Request, Response, NextFunction} from "express";
import { customerRouter } from "./routes/customerRoutes";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const PORT:number = parseInt(`${process.env.PORT}`) || 8080;
connectMongo();
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the directory for the views
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
// Serve static files from a public directory (optional, for CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.use("/customers", customerRouter);

app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`);
});