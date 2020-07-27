import {db} from "../../db";
import {Request} from "express";
const collection = 'users';

export default async (req: Request) => {
    const start = new Date().getTime();
    const knockSnapBefore = await db.collection(`${collection}`).get();
    const end = new Date().getTime();
    console.log(`fs knock snap start: ${start} | end: ${end} | difference: ${end - start}`);
    const count = knockSnapBefore.empty ? 0 : knockSnapBefore.docs.length;
    return {
        message: `Knock returned collection ${collection} with doc count: ${count}.`
    };
}
