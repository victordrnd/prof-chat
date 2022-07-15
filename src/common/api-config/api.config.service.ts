import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) { }

  getApiUrl(): string {
    const apiUrl = this.configService.get<string>('urls.api');
    if (!apiUrl) {
      throw new Error('No API url present');
    }

    return apiUrl;
  }

  getSwaggerUrls(): string[] {
    const swaggerUrls = this.configService.get<string[]>('urls.swagger');
    if (!swaggerUrls) {
      throw new Error('No swagger urls present');
    }

    return swaggerUrls;
  }

  getRedisUrl(): string {
    const redisUrl = this.configService.get<string>('urls.redis');
    if (!redisUrl) {
      throw new Error('No redisUrl present');
    }
    return redisUrl;
  }

  getDatabaseHost(): string {
    const databaseHost = this.configService.get<string>('database.host');
    if (!databaseHost) {
      throw new Error('No database.host present');
    }

    return databaseHost;
  }

  getDatabasePort(): number {
    const databasePort = this.configService.get<number>('database.port');
    if (!databasePort) {
      throw new Error('No database.port present');
    }

    return databasePort;
  }


  getDatabaseUsername(): string {
    const databaseUsername = this.configService.get<string>('database.username');
    if (!databaseUsername) {
      throw new Error('No database.username present');
    }

    return databaseUsername;
  }

  getDatabasePassword(): string {
    const databasePassword = this.configService.get<string>('database.password');
    if (!databasePassword) {
      throw new Error('No database.password present');
    }

    return databasePassword;
  }

  getMapsJWT(): string {
    const maps_jwt = this.configService.get<string>('maps.jwt');
    if (!maps_jwt) {
      throw new Error('No maps.jwt present');
    }

    return maps_jwt;
  }

  getDatabaseName(): string {
    const databaseName = this.configService.get<string>('database.name');
    if (!databaseName) {
      throw new Error('No database.name present');
    }

    return databaseName;
  }

  getDatabaseConnection(): { host: string, port: number, username: string, password: string, database: string } {
    return {
      host: this.getDatabaseHost(),
      port: this.getDatabasePort(),
      username: this.getDatabaseUsername(),
      password: this.getDatabasePassword(),
      database: this.getDatabaseName(),
    };
  }


  getNoSQLDatabaseConnection(): string {
    return `mongodb://${this.getDatabaseHost()}:27017/${this.getDatabaseName()}`;
  }

  getIsPublicApiFeatureActive(): boolean {
    const isApiActive = this.configService.get<boolean>('features.publicApi.enabled');
    if (isApiActive === undefined) {
      throw new Error('No public api feature flag present');
    }

    return isApiActive;
  }

  getPublicApiFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.publicApi.port');
    if (featurePort === undefined) {
      throw new Error('No public api port present');
    }

    return featurePort;
  }

  getIsPrivateApiFeatureActive(): boolean {
    const isApiActive = this.configService.get<boolean>('features.privateApi.enabled');
    if (isApiActive === undefined) {
      throw new Error('No private api feature flag present');
    }

    return isApiActive;
  }

  getPrivateApiFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.privateApi.port');
    if (featurePort === undefined) {
      throw new Error('No private api port present');
    }

    return featurePort;
  }

  getIsCacheWarmerFeatureActive(): boolean {
    const isCacheWarmerActive = this.configService.get<boolean>('features.cacheWarmer.enabled');
    if (isCacheWarmerActive === undefined) {
      throw new Error('No cache warmer feature flag present');
    }

    return isCacheWarmerActive;
  }

  getCacheWarmerFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.cacheWarmer.port');
    if (featurePort === undefined) {
      throw new Error('No cache warmer port present');
    }

    return featurePort;
  }


  getIsQueueWorkerFeatureActive(): boolean {
    const isQueueWorkerActive = this.configService.get<boolean>('features.queueWorker.enabled');
    if (isQueueWorkerActive === undefined) {
      throw new Error('No queue worker feature flag present');
    }

    return isQueueWorkerActive;
  }

  getQueueWorkerFeaturePort(): number {
    const featurePort = this.configService.get<number>('features.queueWorker.port');
    if (featurePort === undefined) {
      throw new Error('No transaction processor port present');
    }

    return featurePort;
  }

  getJwtSecret(): string {
    const jwtSecret = this.configService.get<string>('security.jwtSecret');
    if (!jwtSecret) {
      throw new Error('No jwtSecret present');
    }

    return jwtSecret;
  }

  getSecurityAdmins(): string[] {
    const admins = this.configService.get<string[]>('security.admins');
    if (admins === undefined) {
      throw new Error('No security admins value present');
    }

    return admins;
  }

  getRateLimiterSecret(): string | undefined {
    return this.configService.get<string>('rateLimiterSecret');
  }

  getAxiosTimeout(): number {
    return this.configService.get<number>('keepAliveTimeout.downstream') ?? 61000;
  }

  getIsKeepAliveAgentFeatureActive(): boolean {
    return this.configService.get<boolean>('keepAliveAgent.enabled') ?? true;
  }

  getServerTimeout(): number {
    return this.configService.get<number>('keepAliveTimeout.upstream') ?? 60000;
  }

  getHeadersTimeout(): number {
    return this.getServerTimeout() + 1000;
  }
}