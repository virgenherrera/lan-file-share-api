import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { existsSync } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, parse as pathParse, resolve } from 'path';

import { PagedResults } from '../../application/dto';
import { AppMulterOptions } from '../../upload/imports';
import { PaginationUtil } from '../../utils';
import { FileDto, FolderDto, GetSharedFolderQueryDto } from '../dto';

@Injectable()
export class SharedFolderService {
  constructor(
    private readonly appMulterOptions: AppMulterOptions,
    private readonly logger: Logger,
  ) {}

  async getPagedFolderInfo(
    query: GetSharedFolderQueryDto,
  ): Promise<PagedResults<Array<FileDto | FolderDto>>> {
    this.logger.log(`Getting paginated shared folder content: ${query.path}`);

    const fullPath = this.ensurePath(query.path);
    const directoryItems = await readdir(fullPath);
    const { length: totalRecords } = directoryItems;
    const startIndex = (query.page - 1) * query.perPage;
    const endIndex = startIndex + query.perPage;

    if (startIndex >= totalRecords) {
      throw new BadRequestException(`Page ${query.page} is out of range`);
    }

    const slicedItems = directoryItems.slice(startIndex, endIndex);
    const results: Array<FileDto | FolderDto> = [];

    for (const item of slicedItems) {
      const itemPath = join(fullPath, item);
      const itemStats = await this.parseFileStats(itemPath);
      const parsedPath = pathParse(itemPath);
      const urlPath = join(query.path, parsedPath.base).replace(/\\/g, '/');

      if (itemStats.isDirectory()) {
        results.push({ type: 'folder', name: urlPath });
      } else {
        results.push({
          type: 'file',
          fileName: parsedPath.base,
          path: urlPath,
          createdAt: itemStats.birthtime,
          updatedAt: itemStats.mtime,
          size: this.byteLengthHumanize(itemStats.size),
        } as FileDto);
      }
    }

    return PaginationUtil.getResults(query, results, totalRecords);
  }

  ensurePath(path: string): string {
    const fullPath = resolve(this.appMulterOptions.sharedFolderPath, path);

    if (!existsSync(fullPath)) {
      const errMsg = `Path '${path}' does not exist`;

      this.logger.error(errMsg);

      throw new NotFoundException(errMsg);
    }

    return fullPath;
  }

  parseFileStats(filePath: string) {
    return stat(filePath);
  }

  private byteLengthHumanize(byteLength: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let idx = 0;

    while (byteLength >= 1024) {
      byteLength /= 1024;
      idx++;
    }

    const roundedSize = Math.round(byteLength * 100) / 100;
    const fixedSize = roundedSize.toFixed(2);

    return `${fixedSize} ${units[idx]}`;
  }
}
