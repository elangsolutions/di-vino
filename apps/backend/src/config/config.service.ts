import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private nestConfig: NestConfigService) {}

  get mongoUri(): string | undefined {
    return this.nestConfig.get<string>('mongoUri');
  }

  get port(): number | undefined{
    return this.nestConfig.get<number>('port');
  }

  get mpAccessToken():string | undefined{
    return this.nestConfig.get<string>('MP_ACCESS_TOKEN') || '1234qwerty';
  }

  get mpEnabled(): boolean {
    return this.nestConfig.get<boolean>('MP_ENABLED') ?? false;
  }

  get divinoApp(): string | undefined {
    return this.nestConfig.get<string>('divinoApp');
  }

  get frontendUrls(): string[] {
    const urls = this.nestConfig.get<string>('frontendUrls') || 'http://localhost:5173';
    return urls.split('|').map(url => url.trim());
  }
}
