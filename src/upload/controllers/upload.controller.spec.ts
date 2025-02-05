import { Test, TestingModule } from '@nestjs/testing';
import { MockLoggerProvider } from '../../application/__mocks__';
import { UploadFileDto } from '../dto';
import { UploadService } from '../services';
import { UploadController } from './upload.controller';

describe(`UT:${UploadController.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    uploadFile = 'Should upload a File.',
    uploadManyFiles = 'Should upload a bunch of Files.',
  }

  const mockUploadService = {
    batchCreate: jest.fn(),
    create: jest.fn(),
  } as const;

  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        { provide: UploadService, useValue: mockUploadService },
        MockLoggerProvider,
      ],
    }).compile();

    controller = module.get(UploadController);
  });

  it(should.createInstance, () => {
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(UploadController);
  });

  it(should.uploadFile, async () => {
    const mockBody = {
      path: 'fake/path',
      overwrite: false,
    } as UploadFileDto;
    const mockFile: any = {};
    const mockData: any = { foo: 'bar' };

    mockUploadService.create.mockResolvedValue(mockData);

    const serviceSpy = jest.spyOn(mockUploadService, 'create');

    await expect(controller.uploadFile(mockFile, mockBody)).resolves.toBe(
      mockData,
    );
    expect(serviceSpy).toHaveBeenCalled();
  });

  it(should.uploadManyFiles, async () => {
    const mockBody: any = { path: 'fake/path' };
    const mockFiles: any[] = [{}, {}];
    const mockData: any = { foo: 'bar' };

    mockUploadService.batchCreate.mockResolvedValue(mockData);

    const serviceSpy = jest.spyOn(mockUploadService, 'batchCreate');

    await expect(controller.uploadManyFiles(mockFiles, mockBody)).resolves.toBe(
      mockData,
    );
    expect(serviceSpy).toHaveBeenCalled();
  });
});
