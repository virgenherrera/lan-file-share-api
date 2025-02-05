import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Logger } from '../../common/decorators';
import { PostUploadManyFilesDocs } from '../docs';
import { UploadFileDto, UploadManyResponse, UploadResponse } from '../dto';
import { RequiredFileInterceptor } from '../interceptors';
import { UploadService } from '../services';
import { IncomingFile } from '../types';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  @Logger() private readonly logger: Logger;

  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(
    RequiredFileInterceptor('file', {
      preservePath: true,
      limits: { files: 1 },
    }),
  )
  @ApiOperation({
    description:
      'an endpoint to Upload a single file and share it across your LAN.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @ApiCreatedResponse({ type: UploadResponse })
  async uploadFile(
    @UploadedFile() file: IncomingFile,
    @Body() { path, overwrite }: UploadFileDto,
  ): Promise<UploadResponse> {
    this.logger.log(`processing uploaded File`);

    return await this.uploadService.create(file, { path, overwrite });
  }

  @PostUploadManyFilesDocs()
  async uploadManyFiles(
    @UploadedFiles() files: IncomingFile[],
    @Body() { path, overwrite }: UploadFileDto,
  ): Promise<UploadManyResponse> {
    this.logger.log(`processing uploaded Files`);

    return await this.uploadService.batchCreate(files, { path, overwrite });
  }
}
