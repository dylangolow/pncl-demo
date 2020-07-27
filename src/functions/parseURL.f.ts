import {HttpsError} from "../classes/HttpsError";
import {Request} from "express";
import {getLinkPreview} from 'link-preview-js';

export default async (req: Request) => {
    const {url} = req.params;
    if (!url) {
        throw new HttpsError(
            'invalid-argument',
            'You must pass a url as /parse/:url for this API.'
        )
    }
    const data = await getLinkPreview(url);
    const {title, favicons, images, description}: any = data;

    return {
        title: title || "",
        favicon: favicons[0] || "",
        "large-image": images[0] || "",
        snippet: description || ""
    };
}
