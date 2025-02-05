import { Module } from '@nestjs/common';

import { AppMulterOptions } from '../upload/imports';
import { SharedFolderController } from './controllers';
import { SharedFolderService } from './services';

@Module({
  providers: [AppMulterOptions, SharedFolderService],
  controllers: [SharedFolderController],
})
export class SharedFolderModule {}
