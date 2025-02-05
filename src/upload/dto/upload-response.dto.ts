import { ApiProperty } from '@nestjs/swagger';

export class UploadResponse {
  @ApiProperty({
    description: 'Path to recently uploaded File.',
  })
  path: string;

  @ApiProperty({
    description: 'Message describing status of Upload.',
  })
  message = `successfully uploaded file`;
}
