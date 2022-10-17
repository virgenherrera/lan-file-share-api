import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { MulterConfig } from '../upload/imports';
import { FileSystemService } from '../upload/services/file-system.service';
import { UploadModule } from '../upload/upload.module';
import { SharedFolderController } from './controllers';
import {
  FolderInfoService,
  StreamableFileService,
  StreamableZipFileService,
} from './services';

@Module({
  imports: [CoreModule, UploadModule],
  controllers: [SharedFolderController],
  providers: [
    MulterConfig,
    FileSystemService,
    FolderInfoService,
    StreamableFileService,
    StreamableZipFileService,
  ],
  exports: [FolderInfoService, StreamableFileService, StreamableZipFileService],
})
export class SharedFolderModule {}