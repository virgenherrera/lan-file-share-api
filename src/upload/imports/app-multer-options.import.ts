import { Logger } from '@nestjs/common';
import {
  MulterModule,
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { SharedFolderPath } from '../../common/decorators';

export class AppMulterOptions implements MulterOptionsFactory {
  static get registerAsync() {
    return MulterModule.registerAsync({
      useClass: AppMulterOptions,
    });
  }

  private readonly logger = new Logger(this.constructor.name);
  readonly downloadsPath = resolve(join(homedir(), 'Downloads'));

  constructor(
    @SharedFolderPath()
    private readonly sharedFolderPath: string,
  ) {}

  createMulterOptions(): MulterModuleOptions {
    const { sharedFolderPath: dest } = this;

    this.logger.log(`Configuring multer with shared folder: ${dest}`);

    return { dest };
  }
}
