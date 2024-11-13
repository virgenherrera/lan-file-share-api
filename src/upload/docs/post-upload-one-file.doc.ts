import { applyDecorators, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BadRequest } from '../../common/exceptions';
import { UploadFileDto } from '../dto';
import { UploadRoute } from '../enums';
import { UploadResponse } from '../models';

export function PostUploadOneFileDocs() {
  return applyDecorators(
    Post(UploadRoute.file),
    UseInterceptors(
      FileInterceptor('file', {
        preservePath: true,
        limits: { files: 1 },
      }),
    ),
    ApiOperation({
      summary: `POST ${UploadRoute.file}`,
      description:
        'an endpoint to Upload a single file and share it across your LAN.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiHeader({
      name: 'Authorization',
      description: 'Bearer token',
    }),
    ApiBody({
      type: UploadFileDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. JWT token is missing or invalid.',
    }),
    ApiBadRequestResponse({
      type: BadRequest,
    }),
    ApiCreatedResponse({
      type: UploadResponse,
      description: `${UploadResponse.name} object containing data about uploaded file.`,
    }),
  );
}
