import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { CommandEntity } from './command.entity';
import { CreateCommandDto } from './dto/create-command.dto';
import { GetCommandListDto } from './dto/get-command-list.dto';
import { ErrorType } from './enum/error.enum';

@EntityRepository(CommandEntity)
export class CommandRepository extends Repository<CommandEntity> {
  async createCommand(
    createCommandDto: CreateCommandDto,
  ): Promise<CommandEntity> {
    const command = new CommandEntity();

    command.trigger = createCommandDto.trigger;
    command.data = createCommandDto.data;

    try {
      await command.save();
      return command;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          ErrorType.COMMAND_WITH_THIS_TRIGGER_ALREADY_CREATED,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getCommandList(): Promise<GetCommandListDto> {
    const query = this.createQueryBuilder('command');

    query.select(['command.id', 'command.trigger']);

    const list = await query.getMany();

    return { list };
  }
}
