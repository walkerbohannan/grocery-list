import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import ingredientsRouter from "./routes/IngredientsRouter";

import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use('/ingredients', ingredientsRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});