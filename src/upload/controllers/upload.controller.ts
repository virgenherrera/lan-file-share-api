import {
  Body,
  Controller,
  Get,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';

import { Logger } from '../../common/decorators';
import { BadRequest } from '../../common/exceptions';
import { DtoValidation } from '../../common/pipes';
import { PostUploadManyFilesDocs, PostUploadOneFileDocs } from '../docs';
import { UploadFileDto, UploadFilesDto } from '../dto';
import { UploadRoute } from '../enums';
import { UploadManyResponse, UploadResponse } from '../models';
import { UploadService } from '../services';

@Controller({ version: '1' })
export class UploadController {
  @Logger() private logger: Logger;

  constructor(private uploadService: UploadService) {}

  @Get(UploadRoute.mimeTypes)
  async getMimeTypes() {
    return [{ foo: '' }];
  }

  @PostUploadOneFileDocs()
  async uploadOneFile(
    @Body(DtoValidation.pipe) { path, overwrite }: UploadFileDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<UploadResponse> {
    if (!file) throw new BadRequest('No file uploaded.');

    this.logger.log(`processing uploaded File`);

    return await this.uploadService.create(file, { path, overwrite });
  }

  @PostUploadManyFilesDocs()
  async uploadManyFiles(
    @Body(DtoValidation.pipe) { path, overwrite }: UploadFilesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadManyResponse> {
    if (!files?.length) throw new BadRequest('No files uploaded.');

    this.logger.log(`processing uploaded Files`);

    return await this.uploadService.batchCreate(files, { path, overwrite });
  }
}
