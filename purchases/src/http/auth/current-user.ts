import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface AuthUser {
  sub: string;
}

export const GetUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = GqlExecutionContext.create(context).getContext().req;

    return req.auth;
  },
);
