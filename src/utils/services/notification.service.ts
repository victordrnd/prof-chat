import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as firebase from 'firebase-admin';
import { User } from "src/endpoints/users/entities/user.entity";
const fs = require('fs');
@Injectable()
export class NotificationService {
    constructor() {
        const firebaseCredentials = JSON.parse(fs.readFileSync("./fcm.json"));
        console.log(firebaseCredentials);
        firebase.initializeApp({
            credential: firebase.credential.cert(firebaseCredentials),
        });
    }


    sendToDevice(users: User[], title: string, message: string) {
        const tokens: string[] = users.map(user => user.fcm_token).filter(e => e) as string[];
        console.log(tokens);
        if (tokens.length) {
            console.log('sending to ',tokens);
            firebase.messaging().sendToDevice(tokens, {
                notification: {
                    body: message,
                    title: title,
                }
            });
        }
    }
}