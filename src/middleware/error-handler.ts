import {NextFunction, Request, Response} from "express";
import {HttpsError} from "../classes/HttpsError";

export default (err: HttpsError & Error, req: Request, res: Response, next: NextFunction) => {
	if (err.code === "auth/argument-error") {
		// firebase auth error
		return res.status(401).json({message: 'Unauthenticated.', details: 'You must be authenticated to call this endpoint.'});
	}
	console.error(err.message, err.details);
	// known error
	if (err.status) return res.status(err.status).json( { message: err.message, details: err.details, name: err.name });
	// default to 500 server error
	return res.status(500).json({message: err.message, details: err.details });
}
