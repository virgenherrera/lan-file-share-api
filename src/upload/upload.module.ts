import { Module } from '@nestjs/common';

import { UploadController } from './controllers';
import { AppMulterOptions } from './imports';
import { UploadService } from './services';

@Module({
  imports: [AppMulterOptions.registerAsync],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
