import { Controller, Logger, Param, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DownloadService } from '../services';
import { GetDownloadFileDocs } from './docs';

@ApiTags('download')
@Controller('download')
export class DownloadController {
  constructor(
    private readonly downloadService: DownloadService,
    private readonly logger: Logger,
  ) {}

  @GetDownloadFileDocs()
  async downloadFile(
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    this.logger.log(`Starting file download: ${filename}`);

    return this.downloadService.getStreamableFile(filename);
  }
}
