import {NextFunction, Request, Response} from "express";
import {Storage} from '@google-cloud/storage';
import {STORAGE_BUCKET_NAME} from "../constants";

const slugify = require('slugify');
const storage = new Storage();
console.log('STORAGE_BUCKET_NAME', STORAGE_BUCKET_NAME);
const bucket = storage.bucket(STORAGE_BUCKET_NAME);
import Multer from 'multer';

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    }
});

export default () => {
    return [
        multer.single('file'),
        (req: Request, res: Response, next: NextFunction) => {
            // TODO: add logic to set permissions on items uploaded to only be viewed by user
            if (!req.file) {
                res.status(400).send('No file uploaded.');
                return;
            }
            // Create a new blob in the bucket and upload the file data.
            const blob = bucket.file(slugify(req.file.originalname));
            const blobStream = blob.createWriteStream({resumable: false,});
            blobStream.on('error', (err) => {
                next(err);
            });
            blobStream.on('finish', async () => {
                try {
                    const options = {
                        version: 'v4',
                        action: "read",
                        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
                    };
                    // @ts-ignore
                    const [url] = await storage.bucket(STORAGE_BUCKET_NAME).file(blob.name).getSignedUrl(options);
                    res.status(200).send({url, id: blob.name});
                } catch (err) {
                    next(err);
                }
            });
            blobStream.end(req.file.buffer);
        }
    ];

}
