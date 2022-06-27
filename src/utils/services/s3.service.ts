import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from 'aws-sdk';
import { CachingService } from "src/common/caching/caching.service";
@Injectable()
export class S3Service {
    private s3Client;
    public constructor(private configService: ConfigService) {

        this.s3Client = new S3({
            accessKeyId: this.configService.get('s3.accessKey'),
            secretAccessKey: this.configService.get('s3.secretKey'),
            endpoint: this.configService.get('s3.endpoint'),
            s3ForcePathStyle: true,
            signatureVersion: 'v4'
        });
        console.log(this.configService.get('s3.accessKey'));
    }


    getObjectUrl(path: string) {
        if (path) {
            return this.s3Client.getSignedUrl('getObject', {
                Bucket: "avatars",
                Key: path,
                Expires: 3600
            });
        }
        return undefined;
    }


    uploadFile(file: any) {
        const name = "tchat/" + new Date().getTime() + "-" + file.name;
        this.s3Client.putObject({
            Bucket: 'avatars',
            Key: name,
            Body: file.data
        }).promise().then(res => console.log(res));
        return name;
    }
}