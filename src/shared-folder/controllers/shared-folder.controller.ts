import { Controller, Logger, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PagedResults } from '../../application/dto';
import { GetSharedFolderDocs } from '../docs';
import { FileDto, FolderDto, GetSharedFolderQueryDto } from '../dto';
import { SharedFolderService } from '../services';

@ApiTags('/shared-folder')
@Controller('/shared-folder')
export class SharedFolderController {
  constructor(
    private readonly sharedFolderService: SharedFolderService,
    private readonly logger: Logger,
  ) {}

  @GetSharedFolderDocs()
  async getPagedFolderInfo(
    @Query() query: GetSharedFolderQueryDto,
  ): Promise<PagedResults<Array<FileDto | FolderDto>>> {
    this.logger.verbose(`Getting shared folder ${query.path}`);

    return await this.sharedFolderService.getPagedFolderInfo(query);
  }
}
