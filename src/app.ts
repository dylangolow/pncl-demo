import {Express} from "express";
import bodyParser from 'body-parser';
import errorHandler from './middleware/error-handler';
import express from 'express';
import router from "./controllers/router.controller";
import warmupController from './controllers/warmup.controller';

declare global {
    namespace Express {
        interface Request {
            body: {
                [Key: string]: any
            };
            file: Multer.File,
        }
    }
}

const app: Express = express();
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({extended: false}));


// Routes to controllers
app.use('/', router);
app.use('/_ah/warmup', warmupController);

// global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

export default app;
