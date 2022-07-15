import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from 'aws-sdk';
import { CachingService } from "src/common/caching/caching.service";
@Injectable()
export class S3Service {
    private s3Client;
    public constructor(private configService: ConfigService,
        private cacheService : CachingService) {

        this.s3Client = new S3({
            accessKeyId: this.configService.get('s3.accessKey'),
            secretAccessKey: this.configService.get('s3.secretKey'),
            endpoint: this.configService.get('s3.endpoint'),
            s3ForcePathStyle: true,
            signatureVersion: 'v4'
        });
    }


    getObjectUrl(path: string) {
        if (path) {
            return this.cacheService.getOrSetCache(`s3:${path}`, async () => {
                return await this.s3Client.getSignedUrl('getObject', {
                    Bucket: "avatars",
                    Key: path,
                    Expires: 60 * 60
                });
            }, 60*30);
        }
        return undefined;
    }


    async uploadFile(file: any) {
        const name = "tchat/" + new Date().getTime() + "-" + file.name;
        console.log(name)
        await this.s3Client.putObject({
            Bucket: 'avatars',
            Key: name,
            Body: file.data
        }).promise();
        return name;
    }
}