import { Module } from '@nestjs/common';

import { HealthController } from './application/controllers';
import { AppConfigModule } from './application/imports';
import {
  GlobalValidationPipeProvider,
  PagedResultsInterceptorProvider,
} from './application/providers';
import { CommonModule } from './common/common.module';
import { DownloadModule } from './download/download.module';
import { SharedFolderModule } from './shared-folder/shared-folder.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    AppConfigModule.forRoot,
    CommonModule,
    UploadModule,
    SharedFolderModule,
    DownloadModule,
  ],
  controllers: [HealthController],
  providers: [GlobalValidationPipeProvider, PagedResultsInterceptorProvider],
})
export class AppModule {}
