export class HttpsError extends Error {
    status: number = 500;
    code: CodeStatus = "invalid-argument";
    details?: string | undefined;
    constructor(code: CodeStatus, message?: string, details?: string) {
        super(message);
        Error.captureStackTrace(this, HttpsError);
        this._setStatus(code);
        this.code = code;
        this.details = details;
    }
    private _setStatus(code: string) {
        this.status = HttpsError._getStatus(code);
    }

    private static _getStatus(code: string) {
        return CodeStatus.hasOwnProperty(code) ? CodeStatus[code] : 500;
    }
}

const CodeStatus: any = {
    'invalid-argument': 400,
    'failed-precondition': 400,
    'not-found': 404,
    'unauthenticated': 401,
    'permission-denied': 403,
    'internal': 500,
    'auth/argument-error': 401
};

type CodeStatus = "invalid-argument" | "failed-precondition" | "not-found" | "unauthenticated" | "internal" | "permission-denied" | "auth/argument-error";


