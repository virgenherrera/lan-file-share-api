import { Global, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as MimeDb from 'mime-db';

import { MimeDto } from '../dto';

@Global()
@Injectable()
export class MimeService implements OnModuleInit {
  private mimeMap = new Map<string, MimeDto>();

  constructor(private readonly logger: Logger) {}

  onModuleInit() {
    for (const [type, entry] of Object.entries(MimeDb)) {
      const mimeEntry = plainToInstance(MimeDto, { ...entry, type });

      this.mimeMap.set(type, mimeEntry);

      if (Array.isArray(mimeEntry.extensions)) {
        for (const extension of mimeEntry.extensions)
          this.mimeMap.set(extension, mimeEntry);
      }
    }
  }

  /**
   * Checks if the given MIME type is compressible.
   *
   * @param mimeType - The MIME type to check.
   * @returns True if the MIME type is compressible, false otherwise.
   *
   * @example
   * const result = mimeService.isCompresible('text/html');
   * console.log(result); // true or false
   */
  isCompresible(mimeType: string): boolean {
    const entry = this.mimeMap.get(mimeType);
    const compressible = entry ? Boolean(entry.compressible) : false;

    this.logger.debug(
      `isCompresible - MIME type: ${mimeType}, result: ${compressible}`,
    );

    return compressible;
  }

  /**
   * Retrieves the first file extension associated with the given MIME type.
   *
   * @param mimeType - The MIME type.
   * @returns The first associated extension or null if none exist.
   *
   * @example
   * const extension = mimeService.getExtension('application/json');
   * console.log(extension); // "json"
   */
  getExtension(mimeType: string): string | null {
    const entry = this.mimeMap.get(mimeType);
    const extension =
      entry && Array.isArray(entry.extensions) ? entry.extensions[0] : null;

    this.logger.debug(
      `getExtension - MIME type: ${mimeType}, extension: ${extension}`,
    );

    return extension;
  }
  /**
   * Retrieves the MIME type associated with the given file extension.
   * The extension can be provided with or without a leading dot.
   *
   * @param extension - The file extension (with or without a dot).
   * @returns The associated MIME type or null if not found.
   *
   * @example
   * const mimeType1 = mimeService.getMime('html');
   * console.log(mimeType1); // "text/html"
   *
   * const mimeType2 = mimeService.getMime('.html');
   * console.log(mimeType2); // "text/html"
   */
  getMime(extension: string): string | null {
    const normalizedExtension = extension.replace(/\./g, '');
    const entry = this.mimeMap.get(normalizedExtension);
    const mimeType = entry ? entry.type : null;

    this.logger.debug(
      `getMime - extension: ${extension} (normalized: ${normalizedExtension}), MIME type: ${mimeType}`,
    );

    return mimeType;
  }
}
