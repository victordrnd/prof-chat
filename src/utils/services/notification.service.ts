import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as firebase from 'firebase-admin';
import { DataMessagePayload } from "firebase-admin/lib/messaging/messaging-api";
import { join } from "path";
import { User } from "src/endpoints/users/entities/user.entity";
const fs = require('fs');
@Injectable()
export class NotificationService {
    constructor() {
        const firebaseCredentials = JSON.parse(fs.readFileSync(join(process.cwd(),"fcm.json")));
        console.log(firebaseCredentials);
        firebase.initializeApp({
            credential: firebase.credential.cert(firebaseCredentials),
        });
    }


    sendToDevice(users: User[], title: string, message: string, data : DataMessagePayload = {}) {
        const tokens: string[] = users.map(user => user.fcm_token).filter(e => e) as string[];
        if (tokens.length) {
            firebase.messaging().sendToDevice(tokens, {
                notification: {
                    body: message,
                    title: title,
                },
                data : data
            });
        }
    }
}