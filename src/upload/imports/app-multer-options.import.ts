import { Inject, Logger } from '@nestjs/common';
import {
  MulterModule,
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { access, constants as FS_CONSTANTS, mkdir } from 'fs/promises';
import { homedir } from 'os';
import { isAbsolute, join, resolve } from 'path';
import { appConfig, AppConfig, UploadConfig, uploadConfig } from '../../config';

export class AppMulterOptions implements MulterOptionsFactory {
  static get registerAsync() {
    return MulterModule.registerAsync({
      useClass: AppMulterOptions,
    });
  }

  private readonly logger = new Logger(this.constructor.name);
  readonly downloadsPath = resolve(join(homedir(), 'Downloads'));

  constructor(
    @Inject(appConfig.KEY) private readonly appCfg: AppConfig,
    @Inject(uploadConfig.KEY) private readonly uploadCfg: UploadConfig,
  ) {}

  get sharedFolderPath() {
    const { uploadsPath } = this.uploadCfg;

    if (!uploadsPath) {
      const finalPath = join(this.downloadsPath, this.appCfg.name);

      this.logger.log(`Using default folder: '${finalPath}' `);

      return finalPath;
    }

    const finalPath = isAbsolute(uploadsPath)
      ? uploadsPath
      : join(process.cwd(), uploadsPath);

    this.logger.log(`Using custom uploadsPath: '${finalPath}'`);

    return finalPath;
  }

  async createMulterOptions(): Promise<MulterModuleOptions> {
    this.logger.log(`Creating multer options...`);

    const { sharedFolderPath } = this;

    try {
      await access(sharedFolderPath, FS_CONSTANTS.F_OK);
      this.logger.log(`Directory already exists: '${sharedFolderPath}'`);
    } catch {
      await mkdir(sharedFolderPath, { recursive: true });
      this.logger.log(`Directory created: '${sharedFolderPath}'`);
    }

    this.logger.log(`Storing files in: '${sharedFolderPath}'`);

    return { dest: sharedFolderPath };
  }
}
