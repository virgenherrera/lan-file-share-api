import { NotFoundException, StreamableFile } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';

import { MockLoggerProvider } from '../../application/__mocks__';
import { SharedFolderPathProvider } from '../../common/providers';
import {
  mockMimeService,
  MockMimeServiceProvider,
} from '../../common/services/__mocks__';
import { SharedFolderService } from '../../shared-folder/services';
import { DownloadService } from './download.service';

describe(`UT:${DownloadService.name}`, () => {
  const enum should {
    createInstance = 'should create an instance properly.',
    throwNotFoundIfPathTraversal = 'should throw NotFoundException if path traversal is attempted.',
    throwNotFoundIfFileDoesNotExist = 'should throw NotFoundException if file does not exist.',
    returnStreamableFile = 'should return a StreamableFile for a valid file.',
    throwNotFoundIfFileStatsCannotBeRetrieved = 'should throw NotFoundException if file stats cannot be retrieved.',
    returnFallbackMimeTypeIfMimeIsNull = 'should return a fallback mime type if mime type is undefined',
  }

  const mockSharedFolderService = {
    ensurePath: jest.fn(),
    parseFileStats: jest.fn(),
  };

  let service: DownloadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SharedFolderService,
          useValue: mockSharedFolderService,
        },
        {
          provide: SharedFolderPathProvider.provide,
          useValue: '/base/directory',
        },
        MockMimeServiceProvider,
        MockLoggerProvider,
        DownloadService,
      ],
    }).compile();

    service = module.get(DownloadService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it(should.createInstance, () => {
    expect(service).not.toBeNull();
    expect(service).toBeInstanceOf(DownloadService);
  });

  it(should.throwNotFoundIfPathTraversal, async () => {
    await expect(service.getStreamableFile('../../etc/passwd')).rejects.toThrow(
      NotFoundException,
    );
  });

  it(should.throwNotFoundIfFileDoesNotExist, async () => {
    mockSharedFolderService.ensurePath.mockImplementation(() => {
      throw new NotFoundException();
    });

    await expect(
      service.getStreamableFile('non-existent-file.pdf'),
    ).rejects.toThrow(NotFoundException);
  });

  it(should.returnStreamableFile, async () => {
    const validFilename = 'valid-file.pdf';
    const filePath = `/base/directory/${validFilename}`;
    const fakeFileStats = { size: 12345 };

    mockSharedFolderService.ensurePath.mockReturnValue(filePath);
    mockSharedFolderService.parseFileStats.mockResolvedValue(fakeFileStats);

    const getMimeSpy = jest
      .spyOn(mockMimeService, 'getMime')
      .mockReturnValue('image/jpeg');
    const createReadStreamSpy = jest
      .spyOn(fs, 'createReadStream')
      .mockReturnValue({} as any);

    const result = await service.getStreamableFile(validFilename);

    expect(result).toBeInstanceOf(StreamableFile);
    expect(getMimeSpy).toHaveBeenCalledTimes(1);
    expect(createReadStreamSpy).toHaveBeenCalledTimes(1);
  });

  it(should.throwNotFoundIfFileStatsCannotBeRetrieved, async () => {
    const validFilename = 'valid-file.pdf';
    const filePath = `/base/directory/${validFilename}`;

    mockSharedFolderService.ensurePath.mockReturnValue(filePath);
    mockSharedFolderService.parseFileStats.mockRejectedValue(
      new NotFoundException('File metadata not accessible'),
    );

    await expect(service.getStreamableFile(validFilename)).rejects.toThrow(
      NotFoundException,
    );
  });

  it(should.returnFallbackMimeTypeIfMimeIsNull, async () => {
    const validFilename = 'valid-file.pdf';
    const filePath = `/base/directory/${validFilename}`;
    const fakeFileStats = { size: 12345 };

    mockSharedFolderService.ensurePath.mockReturnValue(filePath);
    mockSharedFolderService.parseFileStats.mockResolvedValue(fakeFileStats);

    const getMimeSpy = jest
      .spyOn(mockMimeService, 'getMime')
      .mockReturnValue(null);
    const createReadStreamSpy = jest
      .spyOn(fs, 'createReadStream')
      .mockReturnValue({} as any);

    const result = await service.getStreamableFile(validFilename);

    expect(result).toBeInstanceOf(StreamableFile);
    expect(getMimeSpy).toHaveBeenCalledTimes(1);
    expect(createReadStreamSpy).toHaveBeenCalledTimes(1);

    expect(result.options.type).toBe('application/octet-stream');
  });
});
