import { applyDecorators, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NotFound } from '../../common/exceptions';
import { ZipFilesDto } from '../dto';
import { SharedFolderRoute } from '../enums';

export function GetZipFileDocs() {
  return applyDecorators(
    Post(SharedFolderRoute.zipFile),
    HttpCode(200),
    ApiOperation({
      summary: `POST ${SharedFolderRoute.zipFile}`,
      description:
        'Get a ZIP compressed file which contains containing requested files to download.',
    }),
    ApiBody({
      type: ZipFilesDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. JWT token is missing or invalid.',
    }),
    ApiBadRequestResponse({
      type: NotFound,
    }),
    ApiOkResponse({
      description: `Raw ZIP File to download.`,
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
  );
}
