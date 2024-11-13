import { NestApplication } from '@nestjs/core';
import { SharedFolderRoute } from '../../../src/shared-folder/enums';
import {
  dropSharedFiles,
  initSharedFiles,
  mockSharedFiles,
  TestContext,
} from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throw404Files = 'Should throw 404 when any of the files does not exists.',
  postZipFile = 'Should respond with Zipped file properly.',
}

describe(`e2e:(POST)${SharedFolderRoute.zipFile}`, () => {
  let testCtx: TestContext = null;

  beforeAll(async () => {
    testCtx = await TestContext.getInstance();

    await initSharedFiles(testCtx);
  });

  afterAll(async () => {
    await dropSharedFiles(testCtx);
  });

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throw404Files, async () => {
    const reqBody = {
      filePaths: ['non-existent-file-01.txt'],
    };
    const { status, body } = await testCtx.request
      .post(SharedFolderRoute.zipFile)
      .send(reqBody);

    expect(status).toBe(404);
    expect(body).toMatchObject({
      code: 'not-found-error',
      message: 'Not Found',
      details: reqBody.filePaths.map(file => `Path '${file}' does not exist`),
    });
  });

  it(should.postZipFile, async () => {
    const reqBody = {
      filePaths: mockSharedFiles.map(({ filename }) => filename),
    };
    const { status, headers } = await testCtx.request
      .post(SharedFolderRoute.zipFile)
      .send(reqBody);

    expect(status).toBe(200);
    expect(headers).toMatchObject({
      'content-type': 'application/zip',
      'content-disposition': expect.stringMatching(
        /^attachment;\sfilename="compressed-files_.+"$/,
      ),
      'content-length': expect.stringMatching(/^\d+$/),
    });
  });
});
