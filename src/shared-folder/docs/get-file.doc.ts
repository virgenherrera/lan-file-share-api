import { applyDecorators, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { NotFound } from '../../common/exceptions';
import { GetFileStreamQueryDto } from '../dto';
import { SharedFolderRoute } from '../enums';

export function GetFileDocs() {
  return applyDecorators(
    Get(SharedFolderRoute.fileStream),
    ApiOperation({
      summary: `GET ${SharedFolderRoute.fileStream}`,
      description: 'Get a file to download.',
    }),
    ApiQuery({
      type: GetFileStreamQueryDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. JWT token is missing or invalid.',
    }),
    ApiBadRequestResponse({
      type: NotFound,
    }),
    ApiOkResponse({
      description: `Raw File to download.`,
      headers: {
        'Content-Disposition': {
          schema: {
            type: 'string',
            example: 'attachment; filename="name.pdf"',
            description: `Used only with 'application/pdf' responses`,
          },
        },
      },
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
  );
}
