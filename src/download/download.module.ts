import { Module } from '@nestjs/common';

import { SharedFolderService } from '../shared-folder/services';
import { AppMulterOptions } from '../upload/imports';
import { DownloadController } from './controllers';
import { DownloadService } from './services';

@Module({
  providers: [AppMulterOptions, SharedFolderService, DownloadService],
  controllers: [DownloadController],
})
export class DownloadModule {}
