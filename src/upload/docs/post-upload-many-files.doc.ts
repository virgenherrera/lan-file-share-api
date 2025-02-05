import { applyDecorators, Post, UseInterceptors } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UploadFilesDto, UploadManyResponse } from '../dto';
import { RequiredFilesInterceptor } from '../interceptors';

export function PostUploadManyFilesDocs() {
  return applyDecorators(
    Post('files'),
    ApiOperation({
      description:
        'an endpoint to gracefully Upload many files and share it across your LAN.',
    }),
    UseInterceptors(
      RequiredFilesInterceptor('files[]', 100, {
        preservePath: true,
        limits: { files: 100 },
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: UploadFilesDto,
    }),
    ApiCreatedResponse({
      type: UploadManyResponse,
      description: `${UploadManyResponse.name} instance containing data about uploaded files and errors.`,
    }),
  );
}
