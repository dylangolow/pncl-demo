import {NextFunction, Request, Response} from "express";
import {STORAGE_BUCKET_NAME} from "../constants";

const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {identifier: srcFilename} = req.params;
        const filePath = '/tmp/' + srcFilename;
        const options = { destination: filePath };
        // Download the file
        await storage.bucket(STORAGE_BUCKET_NAME).file(srcFilename).download(options);
        res.download(filePath);
    } catch (err) {
        next(err);
    }
}
