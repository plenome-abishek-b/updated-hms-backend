// aws.config.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

export const awsConfig: AwsConfig = {
  accessKeyId: 'AKIAYGPK65NCOWOGIBWX',
  secretAccessKey: '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',
  region: 'ap-south-1',
  bucketName: 'ophub-dev-bucket',
};
