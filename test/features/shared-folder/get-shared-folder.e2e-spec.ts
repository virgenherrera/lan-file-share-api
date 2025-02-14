import { NestApplication } from '@nestjs/core';

import { FileDtoMatcher, FolderDtoMatcher } from '../../matchers';
import { dropSharedFiles, initSharedFiles, TestContext } from '../../utils';

const API_PATH = '/shared-folder';

describe(`e2e:(GET)${API_PATH}`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    getSharedFolder = 'Should GET shared folder with default paging.',
    getSharedFolderPAged = 'Should GET shared folder with specific paging.',
    throw400 = 'Should GET 400 when requesting non existent paging',
    throw404 = 'Should GET 40 when requesting non existent path',
  }

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

  it(should.getSharedFolder, async () => {
    const { status, body } = await testCtx.request.get(API_PATH);

    console.log(body);
    expect(status).toBe(200);
    expect(body).toMatchObject({
      rows: expect.arrayContaining([FolderDtoMatcher, FileDtoMatcher]),
      pagination: expect.objectContaining({
        page: expect.any(Number),
        perPage: expect.any(Number),
        totalRecords: expect.any(Number),
      }),
    });
    expect(body.pagination).toHaveProperty('prev', null);
    expect(body.pagination).toHaveProperty('next', null);
  });

  it(should.getSharedFolderPAged, async () => {
    const page = 2;
    const perPage = 2;
    const { status, body } = await testCtx.request
      .get(API_PATH)
      .query({ page, perPage });

    expect(status).toBe(200);
    expect(body).toMatchObject({
      rows: expect.arrayContaining([FileDtoMatcher]),
      pagination: expect.objectContaining({
        page,
        perPage,
        totalRecords: expect.any(Number),
      }),
    });
    expect(body.pagination).toHaveProperty('prev', expect.any(String));
    expect(body.pagination).toHaveProperty('next', expect.any(String));
  });

  it(should.throw400, async () => {
    const page = 200;
    const { status, body } = await testCtx.request
      .get(API_PATH)
      .query({ page });

    expect(status).toBe(400);
    expect(body).toMatchObject({
      message: `Page ${page} is out of range`,
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it(should.throw404, async () => {
    const path = 'non/existent/path/to/look/in';
    const { status, body } = await testCtx.request
      .get(API_PATH)
      .query({ path });

    expect(status).toBe(404);
    expect(body).toMatchObject({
      message: `Path '${path}' does not exist`,
      error: 'Not Found',
      statusCode: 404,
    });
  });
});
