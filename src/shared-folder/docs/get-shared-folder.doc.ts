import { applyDecorators, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { NotFound } from '../../common/exceptions';
import { GetSharedFolderQueryDto } from '../dto';
import { SharedFolderRoute } from '../enums';
import { FolderInfo } from '../models';

export function GetSharedFolderDocs() {
  return applyDecorators(
    Get(SharedFolderRoute.sharedFolder),
    ApiOperation({
      summary: `GET ${SharedFolderRoute.sharedFolder}`,
      description: 'Get folder content defined by path queryParam.',
    }),
    ApiQuery({
      type: GetSharedFolderQueryDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. JWT token is missing or invalid.',
    }),
    ApiBadRequestResponse({
      type: NotFound,
    }),
    ApiOkResponse({
      type: FolderInfo,
      description: `${FolderInfo.name} object containing data about shared folder files and sub-folders.`,
    }),
  );
}
