import {HttpsError} from "../classes/HttpsError";
import {db} from "../db";
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('private.key');
const bcrypt = require('bcrypt');
const saltRounds = 10;

type LoginProps = {
    username: string;
    password: string;
}
export const authenticate = async ({username, password}: LoginProps): Promise<any> => {
    if (!username || !password) {
        throw new HttpsError(
            'invalid-argument',
            'Missing username and password from'
        )
    }
    const usersRef = await db.collection('users').where('username', '==', username).limit(1).get();
    if (!usersRef.empty) {
        const user = usersRef.docs[0].data();
        const match: boolean = await bcrypt.compare(password, user.hashPass);
        if (match) {
            const token = await jwt.sign({sub: user.id, role: user.role}, privateKey, {algorithm: 'RS256'});
            const {username} = user;
            return {
                username,
                token
            };
        } else {
            // wrong password
            throw new HttpsError(
                'permission-denied',
                'Incorrect username/password combination.',
                'Incorrect username/password combination.'
            );
        }
    } else {
        // not found - create user
        let hashPass = await bcrypt.hash(password, saltRounds);
        await db.collection('users').add({username, hashPass});
        return await authenticate({username, password});
    }
}
