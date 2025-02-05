import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SoftBatchCreated } from '../types';
import { UploadResponse } from './upload-response.dto';

export class UploadManyResponse implements SoftBatchCreated<UploadResponse> {
  @ApiProperty({
    description:
      'The keys of this object will match the file index received in the "file[]" field' +
      `and the values are objects of type ${UploadResponse.name}.`,
    patternProperties: {
      '^\\d+$': {
        $ref: getSchemaPath(UploadResponse),
      },
    },
  })
  successes: Record<number, UploadResponse> = {};

  @ApiProperty({
    description:
      'The keys of this object will match the file index received in the "file[]" field' +
      `and the values is an String describing the  error for given file.`,
    patternProperties: {
      '^\\d+$': {
        type: 'string',
      },
    },
  })
  errors: Record<number, string> = {};
}
