import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({
    example: 'file',
    description: 'Type of the item.',
  })
  type: 'file';

  @ApiProperty({
    example: 'report.pdf',
    description: 'The name of the file.',
  })
  fileName: string;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'The mime-type of the file.',
  })
  mimeType: null | string;

  @ApiProperty({
    example: 'Documents/report.pdf',
    description: 'Path where the file is located.',
  })
  path: string;

  @ApiProperty({
    example: '2MB',
    description: 'File size in a human-readable format.',
  })
  size: string;

  @ApiProperty({
    example: '2024-01-29T12:00:00.000Z',
    description: 'File creation date.',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-29T12:30:00.000Z',
    description: 'File last modified date.',
  })
  updatedAt: Date;
}
