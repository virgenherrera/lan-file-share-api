import { Test, TestingModule } from '@nestjs/testing';

import { MockLoggerProvider } from '../../application/__mocks__';
import { DownloadService } from '../services';
import { DownloadController } from './download.controller';

describe(`UT:${DownloadController.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getSteamableFile = 'should get Streamable File from service.',
  }

  const mockDownloadService = {
    getStreamableFile: jest.fn(),
  };

  let controller: DownloadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownloadController],
      providers: [
        { provide: DownloadService, useValue: mockDownloadService },
        MockLoggerProvider,
      ],
    }).compile();

    controller = module.get(DownloadController);
  });

  it(should.createInstance, () => {
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(DownloadController);
  });

  it(should.getSteamableFile, async () => {
    const param = 'file-name-in-param.ext';
    const expectedResponse = { foo: 'bar', baz: [1, 2, Infinity] };
    const getStreamableFileSpy = jest
      .spyOn(mockDownloadService, 'getStreamableFile')
      .mockResolvedValueOnce(expectedResponse);

    await expect(controller.downloadFile(param)).resolves.toBe(
      expectedResponse,
    );
    expect(getStreamableFileSpy).toHaveBeenCalledWith(param);
  });
});
