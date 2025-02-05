import { Test, TestingModule } from '@nestjs/testing';
import { MockLoggerProvider } from '../../application/__mocks__';
import { GetSharedFolderQueryDto } from '../dto';
import { SharedFolderService } from '../services';
import { SharedFolderController } from './shared-folder.controller';

describe(`UT:${SharedFolderController.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    getPagedFolderInfo = 'Should get paged folder Info.',
  }

  const mockSharedFolderService = {
    getPagedFolderInfo: jest.fn(),
  } as const;

  let controller: SharedFolderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedFolderController],
      providers: [
        { provide: SharedFolderService, useValue: mockSharedFolderService },
        MockLoggerProvider,
      ],
    }).compile();

    controller = module.get(SharedFolderController);
  });

  it(should.createInstance, () => {
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(SharedFolderController);
  });

  it(should.getPagedFolderInfo, async () => {
    const query = new GetSharedFolderQueryDto();
    const expectedResponse = { foo: 'bar', baz: 9 };
    const spy = jest
      .spyOn(mockSharedFolderService, 'getPagedFolderInfo')
      .mockResolvedValue(expectedResponse);

    await expect(controller.getPagedFolderInfo(query)).resolves.toBe(
      expectedResponse,
    );
    expect(spy).toHaveBeenCalledWith(query);
  });
});
