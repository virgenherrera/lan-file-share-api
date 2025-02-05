import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePagedParamsDto } from '../../application/dto';

export class GetSharedFolderQueryDto extends BasePagedParamsDto {
  @ApiPropertyOptional({
    description: 'a PATH to sub folder to fetch content data',
    example: 'path/to/fetch',
    default: '',
    type: String,
  })
  @IsOptional()
  @IsString()
  path = '';
}
