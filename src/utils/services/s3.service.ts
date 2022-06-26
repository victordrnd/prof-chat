import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from 'aws-sdk';
import { CachingService } from "src/common/caching/caching.service";
@Injectable()
export class S3Service{
    private s3Client;
    public constructor(private configService: ConfigService){

        this.s3Client = new S3({
            accessKeyId: this.configService.get('s3.accessKey'),
            secretAccessKey: this.configService.get('s3.secretKey'),
            endpoint : this.configService.get('s3.endpoint')
        });
        console.log(this.configService.get('s3.accessKey'));
    }


    getObjectUrl(path : string){
        return this.s3Client.getSignedUrlPromise('getObject', {
            Bucket : "test",
            Key : path,
            Expires : 3600
        });
    }
}