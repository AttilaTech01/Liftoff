import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(routes);

globalThis.appName = "Liftoff";

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
});

app.listen(port, () => console.log(`${globalThis.appName} is listening at http://localhost:${port}`));

export default app;
