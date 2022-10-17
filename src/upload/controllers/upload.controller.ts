import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BadRequest } from '../../core/exceptions';
import { DtoValidation } from '../../core/pipes';
import { MediaMimeTypes } from '../constants';
import { uploadManyDocs, UploadOneDocs } from '../docs';
import { UploadPathDto } from '../dto';
import { UploadRoute } from '../enums';
import {
  UploadedFileInterceptor,
  UploadedFilesInterceptor,
} from '../interceptors';
import { FileWithDestinationPath, MulterFile } from '../interfaces';
import { UploadManyResponse, UploadResponse } from '../models';
import { UploadRepository } from '../repositories';

@Controller()
export class UploadController {
  private logger = new Logger(this.constructor.name);

  constructor(private uploadRepository: UploadRepository) {}

  @Get(UploadRoute.mimeTypes)
  async getMimeTypes() {
    return { data: MediaMimeTypes };
  }

  @Post(UploadRoute.file)
  @UploadOneDocs()
  @UseInterceptors(UploadedFileInterceptor(MediaMimeTypes))
  async uploadOne(
    @Body(DtoValidation.pipe) body: UploadPathDto,
    @UploadedFile('file') dto?: MulterFile,
  ): Promise<UploadResponse> {
    if (!dto) throw new BadRequest('No file uploaded.');

    this.logger.log(`processing uploaded File`);
    const fileWithDestinationPath: FileWithDestinationPath = {
      ...dto,
      destinationPath: body.path,
    };

    return await this.uploadRepository.create(fileWithDestinationPath);
  }

  @Post(UploadRoute.files)
  @uploadManyDocs()
  @UseInterceptors(UploadedFilesInterceptor(MediaMimeTypes))
  async uploadMany(
    @Body(DtoValidation.pipe) body: UploadPathDto,
    @UploadedFiles() dtos: MulterFile[],
  ): Promise<UploadManyResponse> {
    if (!dtos?.length) throw new BadRequest('No files uploaded.');

    this.logger.log(`processing uploaded Files`);

    const filesWithDestinationPath: FileWithDestinationPath[] = dtos.map(
      dto => ({ ...dto, destinationPath: body.path }),
    );

    return await this.uploadRepository.batchCreate(filesWithDestinationPath);
  }
}