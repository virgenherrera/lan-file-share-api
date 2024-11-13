import { NestApplication } from '@nestjs/core';
import { UploadRoute } from '../../../src/upload/enums';
import {
  dropSharedFiles,
  initSharedFiles,
  mockSharedFiles,
  TestContext,
} from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throwPostFile = `Should respond with 400 when calling the endpoint without a file.`,
  throwAlreadyExists = `Should respond with 400 when file already exists.`,
  postFile = `Should POST a file properly.`,
}

describe(`e2e:(POST)${UploadRoute.file}`, () => {
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

  it(should.throwPostFile, async () => {
    const { status, body } = await testCtx.request.post(UploadRoute.file);

    expect(status).toBe(400);
    expect(body).toMatchObject({
      code: 'bad-request-error',
      message: 'Bad Request',
      details: ['No file uploaded.'],
    });
  });

  it(should.throwAlreadyExists, async () => {
    const [file] = mockSharedFiles;
    const mockBuffer = Buffer.from(file.content);
    const { status, body } = await testCtx.request
      .post(UploadRoute.file)
      .attach('file', mockBuffer, file.filename);

    expect(status).toBe(400);
    expect(body).toMatchObject({
      code: 'bad-request-error',
      message: 'Bad Request',
      details: [`File: '${file.filename}' already exists.`],
    });
  });

  it(should.postFile, async () => {
    const mockFilename = 'test-file';
    const mockBuffer = Buffer.from('another file content');
    const { status, body } = await testCtx.request
      .post(UploadRoute.file)
      .attach('file', mockBuffer, mockFilename);

    expect(status).toBe(201);
    expect(body).toMatchObject({
      message: `successfully uploaded file: '${mockFilename}'`,
      path: mockFilename,
    });
  });
});
