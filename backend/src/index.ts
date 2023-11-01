import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import apiRoutes from './routes/index'
import cors from 'cors';
import path from 'path';
import { connect } from './config/mongoConfig';
const corsOptions = {
  origin: "*"
}

const pathEnv = `.env.${process.env.NODE_ENV}`
dotenv.config({path: pathEnv});
const app: Express = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.set("views", path.join(__dirname, "public/views"));
app.set('view engine', 'ejs');
app.use(cors(corsOptions))
app.use(express.static('public'));
app.use('/', apiRoutes)
app.get('/health', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, async () => {
  await connect()
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
