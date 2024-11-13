import {
  Body,
  Controller,
  Query,
  Response as ResponseDecorator,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '../../common/decorators';
import { DtoValidation } from '../../common/pipes';
import { GetFileDocs, GetSharedFolderDocs, GetZipFileDocs } from '../docs';
import {
  GetFileStreamQueryDto,
  GetSharedFolderQueryDto,
  ZipFilesDto,
} from '../dto';
import { FolderInfo } from '../models';
import {
  FolderInfoService,
  StreamableFileService,
  StreamableZipFileService,
} from '../services';

@Controller({ version: '1' })
export class SharedFolderController {
  @Logger() private logger: Logger;

  constructor(
    private folderInfoService: FolderInfoService,
    private streamableFileService: StreamableFileService,
    private streamableZipFileService: StreamableZipFileService,
  ) {}

  @GetSharedFolderDocs()
  async getSharedFolder(
    @Query(DtoValidation.pipe) query: GetSharedFolderQueryDto,
  ): Promise<FolderInfo> {
    this.logger.verbose(`Getting shared folder ${query.path}`);

    return await this.folderInfoService.findOne(query.path);
  }

  @GetFileDocs()
  async getFile(
    @Query(DtoValidation.pipe) query: GetFileStreamQueryDto,
    @ResponseDecorator({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    this.logger.verbose(`Getting file ${query.path}`);

    const downloadableFile = await this.streamableFileService.findOne(
      query.path,
    );

    response.set(downloadableFile.headers);

    return downloadableFile.streamableFile;
  }

  @GetZipFileDocs()
  async getFilesCompressed(
    @Body(DtoValidation.pipe) body: ZipFilesDto,
    @ResponseDecorator({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    this.logger.verbose(`Compressing zip files...`);

    const downloadableFile = await this.streamableZipFileService.create(body);

    response.set(downloadableFile.headers);

    return downloadableFile.streamableFile;
  }
}
