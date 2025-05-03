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
}
