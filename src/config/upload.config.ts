import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { EnvSchemaLoader } from '../application/utils';

export class UploadConfig {
  @Expose({ name: 'APP_UPLOADS_PATH' })
  @IsOptional()
  readonly uploadsPath: string;
}

export const uploadConfig = EnvSchemaLoader.validate(UploadConfig);
