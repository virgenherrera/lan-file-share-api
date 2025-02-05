import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UploadPathDto {
  @ApiPropertyOptional({
    description: 'An optional path where to store the new file or files.',
    example: 'images/photos',
    default: '',
  })
  @IsOptional()
  @IsString()
  path = '';

  @ApiPropertyOptional({
    description: 'Whether to overwrite existing files with the same name.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  overwrite: boolean = false;
}
