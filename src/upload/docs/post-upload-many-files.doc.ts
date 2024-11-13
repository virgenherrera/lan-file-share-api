import { applyDecorators, Post, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { UploadFilesDto } from '../dto';
import { UploadRoute } from '../enums';
import { UploadManyResponse } from '../models';

export function PostUploadManyFilesDocs() {
  return applyDecorators(
    Post(UploadRoute.files),
    ApiOperation({
      summary: `POST ${UploadRoute.files}`,
      description:
        'an endpoint to gracefully Upload many files and share it across your LAN.',
    }),
    UseInterceptors(
      FilesInterceptor('file[]', 50, {
        preservePath: true,
        limits: { files: 50 },
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiHeader({
      name: 'Authorization',
      description: 'Bearer token',
    }),
    ApiBody({
      type: UploadFilesDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized. JWT token is missing or invalid.',
    }),
    ApiBadRequestResponse({
      type: BadRequest,
    }),
    ApiCreatedResponse({
      type: UploadManyResponse,
      description: `${UploadManyResponse.name} instance containing data about uploaded files and errors.`,
    }),
  );
}
