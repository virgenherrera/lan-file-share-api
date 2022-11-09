import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { NotFound } from '../../common/exceptions';
import { GetSharedFolderQueryDto } from '../dto';
import { SharedFolderRoute } from '../enums';
import { FolderInfo } from '../models';

export function GetSharedFolderDocs() {
  return applyDecorators(
    ApiOperation({
      summary: `GET ${SharedFolderRoute.sharedFolder}`,
      description: 'Get folder content defined by path queryParam.',
    }),
    ApiQuery({
      type: GetSharedFolderQueryDto,
    }),
    ApiBadRequestResponse({
      type: NotFound,
    }),
    ApiResponse({
      type: FolderInfo,
      description: `${FolderInfo.name} object containing data about shared folder files and sub-folders.`,
    }),
  );
}
