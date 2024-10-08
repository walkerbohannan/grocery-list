import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import ingredientsRouter from "./routes/IngredientsRouter";

import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.options('*', cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server :D");
});

app.use('/ingredients', ingredientsRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});