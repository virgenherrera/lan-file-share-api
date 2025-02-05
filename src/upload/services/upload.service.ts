import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { existsSync } from 'fs';
import { mkdir, rename, unlink } from 'fs/promises';
import { join } from 'path';

import { UploadManyResponse, UploadPathDto, UploadResponse } from '../dto';
import { IncomingFile, SoftBatchCreated } from '../types';

@Injectable()
export class UploadService {
  constructor(private readonly logger: Logger) {}

  async batchCreate(
    files: IncomingFile[],
    opts: UploadPathDto,
  ): Promise<SoftBatchCreated<UploadResponse>> {
    const filePromises = files.map((file) => this.create(file, opts));
    const settledPromises = await Promise.allSettled(filePromises);

    return this.mapSettledToResponse(settledPromises);
  }

  async create(
    file: IncomingFile,
    { path, overwrite }: UploadPathDto,
  ): Promise<UploadResponse> {
    const destinyPath = join(file.destination, path);
    const destinyFilePath = join(destinyPath, file.originalname);
    const unixPath = join(path, file.originalname).replace(/\\/g, '/');

    if (!overwrite && existsSync(destinyFilePath)) {
      const errorMessage = `File: '${unixPath}' already exists.`;

      this.logger.log(errorMessage);

      await unlink(file.path);

      throw new BadRequestException(errorMessage);
    }

    await mkdir(destinyPath, { recursive: true });
    await rename(file.path, destinyFilePath);

    const res = plainToInstance(UploadResponse, { path: unixPath });

    this.logger.verbose(res.message);

    return res;
  }

  private mapSettledToResponse(
    promises: PromiseSettledResult<UploadResponse>[],
  ): UploadManyResponse {
    return promises.reduce(
      (acc, curr, idx) => {
        if (curr.status === 'fulfilled') {
          acc.successes[idx] = curr.value;
        } else {
          acc.errors[idx] = curr.reason.response.message;
        }

        return acc;
      },
      plainToInstance(UploadManyResponse, {}),
    );
  }
}
