import { FactoryProvider, Logger } from '@nestjs/common';
import { access, constants as FS_CONSTANTS, mkdir } from 'fs/promises';

import { homedir } from 'os';
import { isAbsolute, join, resolve } from 'path';
import { AppConfig, appConfig, UploadConfig, uploadConfig } from '../../config';

export const SharedFolderPathProvider: FactoryProvider = {
  provide: 'SHARED_FOLDER_PATH',
  inject: [appConfig.KEY, uploadConfig.KEY],
  async useFactory(
    appCfg: AppConfig,
    uploadCfg: UploadConfig,
  ): Promise<string> {
    const logger = new Logger('SharedFolderPathProvider');
    const downloadsPath = resolve(join(homedir(), 'Downloads'));
    let finalPath: string;

    if (!uploadCfg.uploadsPath) {
      finalPath = join(downloadsPath, appCfg.name);
      logger.log(`Using default folder: '${finalPath}'`);
    } else {
      finalPath = isAbsolute(uploadCfg.uploadsPath)
        ? uploadCfg.uploadsPath
        : join(process.cwd(), uploadCfg.uploadsPath);
      logger.log(`Using custom uploadsPath: '${finalPath}'`);
    }

    try {
      await access(finalPath, FS_CONSTANTS.F_OK);
      logger.log(`Directory already exists: '${finalPath}'`);
    } catch {
      await mkdir(finalPath, { recursive: true });
      logger.log(`Directory created: '${finalPath}'`);
    } finally {
      logger.log(`Shared folder set to: '${finalPath}'`);
    }

    return finalPath;
  },
};
