import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandEntity } from '../command.entity';
import { ErrorType } from '../enum/error.enum';

@Injectable()
export class CommandGuard implements CanActivate {
  constructor(
    @InjectRepository(CommandEntity)
    private commandRepository: Repository<CommandEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    const command = await this.commandRepository.findOne({
      where: { id: params.commandId },
    });

    if (!command) {
      throw new NotFoundException(ErrorType.COMMAND_WITH_THIS_ID_NOT_FOUND);
    }

    request.command = command;

    return true;
  }
}
