import {GOOGLE_CLOUD_PROJECT} from "../constants";
import {NextFunction, Request, Response} from "express";
import {wrapped} from "../services/fetchService";
import {HttpsError} from "../classes/HttpsError";
import {google} from "@google-cloud/translate/build/protos/protos";
import IDetectedLanguage = google.cloud.translation.v3.IDetectedLanguage;
import {TranslationServiceClient} from '@google-cloud/translate';
import fs from 'fs';
import {File, Storage} from '@google-cloud/storage';
import {STORAGE_BUCKET_NAME} from "../constants";
import {getLinkPreview} from "link-preview-js";

const translationClient = new TranslationServiceClient();
const location = 'us-central1';
const storage = new Storage();
console.log('STORAGE_BUCKET_NAME', STORAGE_BUCKET_NAME);
const bucket = storage.bucket('pncl-demo-translate-pending');
const inputUriStart = `gs://pncl-demo-translate-pending/`;
const outputUriStart = `gs://pncl-demo-translate-complete/`;

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {targetLanguageCode} = req.body;
        const {url} = req.params;
        console.log(`targetLanguageCode: ${targetLanguageCode} | url: ${url}`)
        if (!targetLanguageCode || !url) {
            throw new HttpsError(
                'invalid-argument',
                'Incomplete request, include the url as translate/:url and targetLanguageCode as a body attribute.'
            )
        }
        const htmlResponse = await wrapped(url, {});
        const html = await htmlResponse.text();
        // upload to translate bucket
        const filename = 'temp.html';
        console.log('filename', filename);
        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({resumable: false,});
        blobStream.on('error', (err) => {
            throw err;
        });
        blobStream.on('finish', async () => {
            try {

                const data = await getLinkPreview(url);
                // @ts-ignore
                const {title, description} = data;
                const detectLangRequest = {
                    parent: `projects/${GOOGLE_CLOUD_PROJECT}/locations/${location}`,
                    content: title + '. ' + description,
                };
                const [detectLangResponse] = await translationClient.detectLanguage(detectLangRequest);

                console.log('Detected Languages:');
                // @ts-ignore
                for (const language of detectLangResponse.languages) {
                    console.log(`Language Code: ${language.languageCode}`);
                    console.log(`Confidence: ${language.confidence}`);
                }
                console.log('detectLangResponse.languages', detectLangResponse.languages);
                // @ts-ignore
                const topLang = detectLangResponse.languages.length > 1 ? detectLangResponse.languages.sort((a: IDetectedLanguage, b: IDetectedLanguage) => b.confidence - a.confidence)[0] : detectLangResponse.languages[0];
                console.log('topLang', topLang);
                // empty bucket
                await storage.bucket(outputUriStart).deleteFiles();
                const translateRequest: google.cloud.translation.v3.IBatchTranslateTextRequest = {
                    parent: `projects/${GOOGLE_CLOUD_PROJECT}/locations/${location}`,
                    sourceLanguageCode: topLang.languageCode || 'en',
                    targetLanguageCodes: [targetLanguageCode],
                    inputConfigs: [
                        {
                            mimeType: 'text/html', // mime types: text/plain, text/html
                            gcsSource: {
                                inputUri: inputUriStart + filename,
                            },
                        },
                    ],
                    outputConfig: {
                        gcsDestination: {
                            outputUriPrefix: outputUriStart,
                        },
                    }
                };
                const [operation] = await translationClient.batchTranslateText(translateRequest);
                const [response] = await operation.promise();
                console.log('response', response);

                const [files] = await storage.bucket(outputUriStart).getFiles();
                let fileDl = files.find((f: File) => f.name.endsWith('.html'));
                console.log('fileDl.name', fileDl?.name);
                if (!fileDl) throw new HttpsError('internal','Can\'t find html file.');
                const filePath = '/tmp/' + fileDl.name;
                const optionsDl = { destination: filePath };
                await fileDl.download(optionsDl);
                await storage.bucket(outputUriStart).deleteFiles();
                const fileToSend = fs.readFileSync(filePath);
                console.log(`fileToSend:`, fileToSend);
                res.send(fileToSend);
            } catch (err) {
                next(err);
            }
        });
        blobStream.end(Buffer.from(html));
    } catch (err) {
        next(err);
    }
}
