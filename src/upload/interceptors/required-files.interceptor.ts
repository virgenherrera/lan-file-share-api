import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Observable } from 'rxjs';

type FilesInterceptorArgs = Parameters<typeof FilesInterceptor>;

export function RequiredFilesInterceptor(
  ...args: FilesInterceptorArgs
): Type<NestInterceptor> {
  class MixinInterceptor
    extends FilesInterceptor(...args)
    implements NestInterceptor
  {
    async intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Promise<Observable<any>> {
      await super.intercept(context, next);

      const request = context.switchToHttp().getRequest<Request>();

      if (!request.files?.length)
        throw new BadRequestException(
          `No file was received in field: "${args[0]}"`,
        );

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
