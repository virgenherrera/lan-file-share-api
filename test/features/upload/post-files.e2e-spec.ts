import { NestApplication } from '@nestjs/core';
import { UploadManyResponse } from '../../../src/upload/dto';
import {
  TestContext,
  dropSharedFiles,
  mockSharedFiles as existentFiles,
  initSharedFiles,
} from '../../utils';

const API_PATH = '/upload/files';
describe(`e2e: POST${API_PATH}`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    throwPostFile = `Should respond with 400 when calling the endpoint without a file.`,
    postFiles = `Should POST many files and get proper info about success and failures preserving post order.`,
  }
  const nonExistentFiles = [
    { filename: `fake_file_1_${Date.now()}.txt`, content: 'mock file content' },
    { filename: `fake_file_2_${Date.now()}.txt`, content: 'mock file content' },
  ];

  let testCtx: TestContext;

  beforeAll(async () => {
    testCtx = await TestContext.getInstance();

    await initSharedFiles(testCtx);
  });

  afterAll(async () => {
    await dropSharedFiles(testCtx);
  });

  it(should.initTestContext, () => {
    expect(testCtx).toBeDefined();
    expect(testCtx.request).toBeDefined();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throwPostFile, async () => {
    const { status, body } = await testCtx.request.post(API_PATH);

    expect(status).toBe(400);
    expect(body).toMatchObject({
      message: `No file was received in field: "files[]"`,
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it(should.postFiles, async () => {
    const matcher: Record<keyof UploadManyResponse, any> = {
      successes: {
        0: {
          message: `successfully uploaded file`,
          path: nonExistentFiles[0].filename,
        },
        2: {
          message: `successfully uploaded file`,
          path: nonExistentFiles[1].filename,
        },
      },
      errors: {
        1: `File: '${existentFiles[0].filename}' already exists.`,
        3: `File: '${existentFiles[1].filename}' already exists.`,
      },
    };
    const { status, body } = await testCtx.request
      .post(API_PATH)
      .attach(
        'files[]',
        Buffer.from(nonExistentFiles[0].content),
        nonExistentFiles[0].filename,
      )
      .attach(
        'files[]',
        Buffer.from(existentFiles[0].content),
        existentFiles[0].filename,
      )
      .attach(
        'files[]',
        Buffer.from(nonExistentFiles[1].content),
        nonExistentFiles[1].filename,
      )
      .attach(
        'files[]',
        Buffer.from(existentFiles[1].content),
        existentFiles[1].filename,
      );

    expect(status).toBe(201);
    expect(body).toMatchObject(matcher);
  });
});
