import {
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { basename, normalize, resolve } from 'path';

import { MimeService } from '../../common/services';
import { SharedFolderService } from '../../shared-folder/services';
import { AppMulterOptions } from '../../upload/imports';

@Injectable()
export class DownloadService {
  constructor(
    private readonly sharedFolderService: SharedFolderService,
    private readonly appMulterOptions: AppMulterOptions,
    private readonly mimeService: MimeService,
    private readonly logger: Logger,
  ) {}

  async getStreamableFile(filename: string): Promise<StreamableFile> {
    this.logger.log(`Starting file download: ${filename}`);

    const filePath = this.getResolvedPath(filename);
    const statsPromise = this.getFileStats(filePath);

    const mimeType =
      this.mimeService.getMime(filePath) ?? 'application/octet-stream';
    this.logger.verbose(`MIME-Type detected: ${mimeType}`);

    const fileStream = createReadStream(filePath);
    this.logger.verbose(`Sending file: ${filePath}`);

    const fileStats = await statsPromise;
    this.logger.verbose(`File size: ${fileStats.size} bytes`);

    return new StreamableFile(fileStream, {
      type: mimeType,
      disposition: `attachment; filename="${basename(filename)}"`,
      length: fileStats.size,
    });
  }

  /**
   * @param filename string
   * @returns string
   * @description Returns a fully resolved path while preventing traversal attacks
   */
  private getResolvedPath(filename: string): string {
    const { sharedFolderPath: baseDir } = this.appMulterOptions;
    const resolvedPath = resolve(baseDir, normalize(filename));

    this.logger.verbose(`Base directory for downloads: ${baseDir}`);

    if (!resolvedPath.startsWith(baseDir)) {
      this.logger.warn(`Potential path traversal attack detected: ${filename}`);
      throw new NotFoundException('Invalid file path');
    }

    this.logger.verbose(`Resolved and validated file path: ${resolvedPath}`);

    try {
      return this.sharedFolderService.ensurePath(resolvedPath);
    } catch (error) {
      this.logger.error(`File not found: ${error.message}`);
      throw new NotFoundException('File not found');
    }
  }

  /**
   * @param filePath string
   * @returns Promise<Stats>
   * @description Get file stats safely
   */
  private async getFileStats(filePath: string) {
    try {
      return await this.sharedFolderService.parseFileStats(filePath);
    } catch (error) {
      this.logger.error(`Failed to retrieve file stats: ${error.message}`);
      throw new NotFoundException('File metadata not accessible');
    }
  }
}
