import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Observable } from 'rxjs';

type FileInterceptorArgs = Parameters<typeof FileInterceptor>;

export function RequiredFileInterceptor(
  ...args: FileInterceptorArgs
): Type<NestInterceptor> {
  class MixinInterceptor
    extends FileInterceptor(...args)
    implements NestInterceptor
  {
    async intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Promise<Observable<any>> {
      await super.intercept(context, next);

      const request = context.switchToHttp().getRequest<Request>();

      if (!request.file)
        throw new BadRequestException(
          `No file was received in field: "${args[0]}"`,
        );

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
