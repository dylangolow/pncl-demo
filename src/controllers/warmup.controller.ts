import {NextFunction, Request, Response, Router} from "express";
import knockFunc from "../functions/warmup/knock.f";

const router: Router = require('express').Router();

router.get('/', knock);

function knock(req: Request, res: Response, next: NextFunction) {
    knockFunc(req)
        .then(result => res.json(result))
        .catch(err => next(err));
}

export default router;
