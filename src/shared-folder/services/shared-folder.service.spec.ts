import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';

import { MockLoggerProvider } from '../../application/__mocks__';
import { PagedResults } from '../../application/dto';
import { SharedFolderPathProvider } from '../../common/providers';
import { GetSharedFolderQueryDto } from '../dto';
import { SharedFolderService } from './shared-folder.service';

describe(`UT:${SharedFolderService.name}`, () => {
  const enum should {
    createInstance = 'should create instance properly.',
    getPagedContents = 'should return paginated contents.',
    throwForInvalidPage = 'should throw BadRequestException for out-of-range page.',
    throwForNonExistentPath = 'should throw NotFoundException for non-existent path.',
  }

  let service: SharedFolderService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockLoggerProvider,
        {
          provide: SharedFolderPathProvider.provide,
          useValue: 'mock-path',
        },
        SharedFolderService,
      ],
    }).compile();

    service = module.get(SharedFolderService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(SharedFolderService);
  });

  it(should.getPagedContents, async () => {
    const mockPath = 'mock-path';
    const mockFullPath = 'mock-full-path';
    const mockFiles = ['file1.txt', 'folder-a'];
    const mockQuery: GetSharedFolderQueryDto = {
      path: mockPath,
      page: 1,
      perPage: 2,
    };

    const resolveSpy = jest
      .spyOn(path, 'resolve')
      .mockReturnValue(mockFullPath);
    const joinSpy = jest
      .spyOn(path, 'join')
      .mockImplementation((...args) => args.join('/'));
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readdirSpy = jest
      .spyOn(fs.promises, 'readdir')
      .mockResolvedValue(mockFiles as any);
    const statSpy = jest
      .spyOn(fs.promises, 'stat')
      .mockResolvedValueOnce({
        isDirectory: () => false,
        size: 2048,
        birthtime: new Date(),
        mtime: new Date(),
      } as fs.Stats)
      .mockResolvedValueOnce({
        isDirectory: () => true,
      } as fs.Stats);

    const result = await service.getPagedFolderInfo(mockQuery);

    // Assert
    expect(result).toBeInstanceOf(PagedResults);

    expect(result.rows.length).toBe(mockQuery.perPage);
    expect(result.rows).toEqual([
      expect.objectContaining({
        type: 'file',
        fileName: 'file1.txt',
        size: '2.00 KB',
      }),
      expect.objectContaining({
        type: 'folder',
        name: 'mock-path/folder-a',
      }),
    ]);

    expect(result.pagination.page).toBe(mockQuery.page);
    expect(result.pagination.perPage).toBe(mockQuery.perPage);

    expect(resolveSpy).toHaveBeenCalledWith(expect.any(String), mockPath);
    expect(joinSpy).toHaveBeenCalled();
    expect(existsSyncSpy).toHaveBeenCalledWith(mockFullPath);
    expect(readdirSpy).toHaveBeenCalledWith(mockFullPath);
    expect(statSpy).toHaveBeenCalledTimes(mockQuery.perPage);
  });

  it(should.throwForInvalidPage, async () => {
    const mockPath = 'mock-path';
    const mockFullPath = 'mock-full-path';
    const mockFiles = ['file1.txt', 'file2.jpg', 'file3.pdf'];
    const mockQuery: GetSharedFolderQueryDto = {
      path: mockPath,
      page: 5, // Fuera de rango
      perPage: 2,
    };

    const resolveSpy = jest
      .spyOn(path, 'resolve')
      .mockReturnValue(mockFullPath);
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readdirSpy = jest
      .spyOn(fs.promises, 'readdir')
      .mockResolvedValue(mockFiles as any);

    await expect(service.getPagedFolderInfo(mockQuery)).rejects.toThrow(
      BadRequestException,
    );

    expect(resolveSpy).toHaveBeenCalledWith(expect.any(String), mockPath);
    expect(existsSyncSpy).toHaveBeenCalledWith(mockFullPath);
    expect(readdirSpy).toHaveBeenCalledWith(mockFullPath);
  });

  it(should.throwForNonExistentPath, async () => {
    const mockPath = 'non-existent-path';
    const mockFullPath = 'non-existent-full-path';
    const mockQuery: GetSharedFolderQueryDto = {
      path: mockPath,
      page: 1,
      perPage: 1,
    };

    const resolveSpy = jest
      .spyOn(path, 'resolve')
      .mockReturnValue(mockFullPath);
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await expect(service.getPagedFolderInfo(mockQuery)).rejects.toThrow(
      NotFoundException,
    );

    expect(resolveSpy).toHaveBeenCalledWith(expect.any(String), mockPath);
    expect(existsSyncSpy).toHaveBeenCalledWith(mockFullPath);
  });
});
