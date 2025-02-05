import { Module } from '@nestjs/common';

import { SharedFolderController } from './controllers';
import { SharedFolderService } from './services';

@Module({
  providers: [SharedFolderService],
  controllers: [SharedFolderController],
})
export class SharedFolderModule {}
