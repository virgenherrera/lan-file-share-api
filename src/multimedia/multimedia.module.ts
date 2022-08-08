import { Module } from '@nestjs/common';
import { FileController } from './controllers/file.controller';
import { MimeTypesController } from './controllers/mime-types.controller';
import { UploadController } from './controllers/upload.controller';
import { MulterConfigModule } from './modules';
import {
  FileSystemService,
  SharedFolderService,
  UploadService,
} from './services';

@Module({
  imports: [MulterConfigModule.registerAsync()],
  controllers: [UploadController, MimeTypesController, FileController],
  providers: [FileSystemService, UploadService, SharedFolderService],
  exports: [UploadService, SharedFolderService],
})
export class MultimediaModule {}
