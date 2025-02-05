import { Module } from '@nestjs/common';

import { SharedFolderService } from '../shared-folder/services';
import { DownloadController } from './controllers';
import { DownloadService } from './services';

@Module({
  providers: [SharedFolderService, DownloadService],
  controllers: [DownloadController],
})
export class DownloadModule {}
