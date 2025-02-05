import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { of } from 'rxjs';

import { RequiredFilesInterceptor } from './required-files.interceptor';

describe(`UT:${RequiredFilesInterceptor.name}`, () => {
  const enum should {
    createInstance = 'should create instance Properly.',
    throwBadRequest = 'should throw BadRequestException if no file is present',
    continuetoNextHandle = 'should not throw if file is present',
  }

  let factory: Type<NestInterceptor>;
  let interceptor: NestInterceptor;

  beforeEach(() => {
    factory = RequiredFilesInterceptor('files[]');
    interceptor = new factory();
  });

  it(should.createInstance, () => {
    expect(interceptor).toBeDefined();
    expect(interceptor).toBeInstanceOf(factory);
  });

  it(should.throwBadRequest, async () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({ getRequest: () => ({ file: undefined }) }),
    } as unknown as ExecutionContext;
    const mockNext: CallHandler = {
      handle: jest.fn().mockReturnValue(of(null)),
    };

    const nextHandleSpy = jest.spyOn(mockNext, 'handle');
    const parentInterceptSpy = jest
      .spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(interceptor)),
        'intercept',
      )
      .mockReturnValue(jest.fn().mockReturnValue(of(null)));

    // Act & Assert
    await expect(interceptor.intercept(mockContext, mockNext)).rejects.toThrow(
      BadRequestException,
    );

    expect(parentInterceptSpy).toHaveBeenCalledTimes(1);
    // ensure next.handle() was NOT called
    expect(nextHandleSpy).not.toHaveBeenCalled();
  });

  it(should.continuetoNextHandle, async () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ files: [{ originalname: 'test.png' }] }),
      }),
    } as unknown as ExecutionContext;
    const mockNext: CallHandler = {
      handle: jest.fn().mockReturnValue(of(null)),
    };

    const nextHandleSpy = jest.spyOn(mockNext, 'handle');
    const parentInterceptSpy = jest
      .spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(interceptor)),
        'intercept',
      )
      .mockReturnValue(jest.fn().mockReturnValue(of(null)));

    // Act
    const result = interceptor.intercept(mockContext, mockNext);

    // Assert
    await expect(result).resolves.not.toThrow();
    expect(parentInterceptSpy).toHaveBeenCalledTimes(1);
    // ensure next.handle() was called
    expect(nextHandleSpy).toHaveBeenCalledTimes(1);
  });
});
