import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UploadController } from './controllers';
import { MulterConfig } from './imports';
import { UploadRepository } from './repositories';
import { FileSystemService } from './services';

@Module({
  imports: [CoreModule, MulterConfig.registerAsync()],
  controllers: [UploadController],
  providers: [MulterConfig, FileSystemService, UploadRepository],
  exports: [FileSystemService, UploadRepository],
})
export class UploadModule {}