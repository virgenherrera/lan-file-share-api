import { applyDecorators, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';

export function GetDownloadFileDocs() {
  return applyDecorators(
    Get(':filename'),
    ApiOperation({ summary: 'Download a file' }),
    ApiParam({
      name: 'filename',
      description: 'The name of the file to download',
      example: 'reports/summary.pdf',
    }),
    ApiProduces('application/octet-stream'),
    ApiOkResponse({
      description: 'File downloaded successfully',
      content: {
        'application/octet-stream': {
          schema: { type: 'string', format: 'binary' },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'File not found' }),
  );
}
