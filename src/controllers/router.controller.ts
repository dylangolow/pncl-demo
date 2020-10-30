import {NextFunction, Request, Response, Router} from "express";
import {authenticate} from "../functions/login.f";
import parseURLFunc from "../functions/parseURL.f";
import translateURLFunc from "../functions/translateURL.f";
import uploadFunc from "../functions/upload.f";
import downloadFunc from "../functions/download.f";
import authorize from "../middleware/authorize";

const router: Router = require('express').Router();
router.get('/login/:username/:password', login);
router.post('/login', loginNew);
router.use(authorize());
router.post('/upload', uploadFunc());
router.get('/parse/:url', parseURL);
router.post('/translate/:url', translateURLFunc);
router.get('/download/:identifier', downloadFunc);

function login(req: Request, res: Response, next: NextFunction) {
    const {username, password} = req.params;
    authenticate({username, password})
        .then(result => res.json(result))
        .catch(err => next(err));
}

function loginNew(req: Request, res: Response, next: NextFunction) {
    const {username, password} = req.body;
    authenticate({username, password})
        .then(result => res.json(result))
        .catch(err => next(err));
}

function parseURL(req: Request, res: Response, next: NextFunction) {
    parseURLFunc(req)
        .then(result => res.json(result))
        .catch(err => next(err));
}

export default router;
