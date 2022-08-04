import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, existsSync, readdir, stat, Stats } from 'fs';
import { mkdir, rename, unlink } from 'fs/promises';
import { basename, extname, join, parse, ParsedPath, resolve } from 'path';
import { BadRequest } from '../../core/exceptions';
import { MediaMimeTypeSource, SHARED_FOLDER_PATH } from '../constants';
import { MultimediaRoute } from '../enums';
import { FileInfo, FolderInfo } from '../models';
import { DownloadableFile } from '../models/downloadable-file.model';

@Injectable()
export class FileSystemService {
  private logger = new Logger(this.constructor.name);
  private readonly destiny = SHARED_FOLDER_PATH;

  async getDownloadableFile(path: string): Promise<DownloadableFile> {
    this.logger.log(`Getting file ${path}`);

    const filePath = this.getFullPath(path);
    const fileSteam = createReadStream(filePath);
    const fileName = basename(filePath);
    const fileExt = extname(filePath);
    const [, , mimeType] = MediaMimeTypeSource.find(row => row[0] === fileExt);

    return new DownloadableFile(fileName, mimeType, fileSteam);
  }

  async getPathInfo(path = ''): Promise<FolderInfo> {
    this.logger.log(`Getting shared folder ${path}`);

    const fullPath = this.getFullPath(path);
    const res = new FolderInfo();
    const pathContentList = await this.readDirPromise(fullPath);

    for await (const pathElement of pathContentList) {
      const elementPath = join(fullPath, pathElement);
      const elementStats = await this.statPromise(elementPath);
      const parsedPath = parse(elementPath);

      if (elementStats.isDirectory()) {
        const childPath = this.toUnixPath(path, parsedPath.name);

        res.folders.push(childPath);
      } else {
        const fileInfo = this.getFileInfo(path, parsedPath, elementStats);

        res.files.push(fileInfo);
      }
    }

    return res;
  }

  toUnixPath(...paths: string[]) {
    return join(...paths).replace(/\\/g, '/');
  }

  makeSubPath(subPath: string) {
    const path = join(SHARED_FOLDER_PATH, subPath);

    return mkdir(path, { recursive: true });
  }

  async renameFile(oldPath: string, newPath: string) {
    await rename(oldPath, newPath);

    this.logger.verbose(`file: ${oldPath} renamed to: ${newPath}`);
  }

  async deleteFile(filePath: string) {
    await unlink(filePath);

    this.logger.verbose(`file: ${filePath} deleted`);
  }

  private getFileInfo(
    path: string,
    parsedPath: ParsedPath,
    elementStats: Stats,
  ) {
    const href = this.toUnixPath(
      '/api/v1',
      MultimediaRoute.fileStream.replace('*', ''),
      path,
      parsedPath.base,
    );

    return new FileInfo({
      href,
      ...elementStats,
      ...parsedPath,
    });
  }
  private getFullPath(path: string): string | never {
    const fullPath = resolve(join(this.destiny, path));

    if (!existsSync(fullPath)) {
      const errMsg = `Path ${path} does not exist`;

      this.logger.error(errMsg);

      throw new BadRequest(errMsg);
    }

    return fullPath;
  }

  private readDirPromise(path: string): Promise<string[]> {
    return new Promise((Resolve, Reject) =>
      readdir(path, (error, files) =>
        !error ? Resolve(files) : Reject(error),
      ),
    );
  }

  private statPromise(path: string): Promise<Stats> {
    return new Promise((Resolve, Reject) =>
      stat(path, (error, stats) => (!error ? Resolve(stats) : Reject(error))),
    );
  }
}