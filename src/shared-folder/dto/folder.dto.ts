import { ApiProperty } from '@nestjs/swagger';

export class FolderDto {
  @ApiProperty({
    example: 'Documents',
    description: 'The name of the folder.',
  })
  name: string;

  @ApiProperty({ example: 'folder', description: 'Type of the item.' })
  type: 'folder';
}
