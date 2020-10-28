import { createParamDecorator } from '@nestjs/common';
import { CommandEntity } from '../command.entity';

interface RequestData extends Request {
  command: CommandEntity;
}

export const GetCommand = createParamDecorator(
  (data: string, request: RequestData) => {
    const command: CommandEntity = request.command;

    return data ? command && command[data] : command;
  },
);
