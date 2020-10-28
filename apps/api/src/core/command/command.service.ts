import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandEntity } from './command.entity';

import { CommandRepository } from './command.repository';
import { CreateCommandDto } from './dto/create-command.dto';
import { GetCommandListDto } from './dto/get-command-list.dto';
import { UpdateCommandDto } from './dto/update-command.dto';

@Injectable()
export class CommandService {
  constructor(
    @InjectRepository(CommandRepository)
    private commandRepository: CommandRepository,
  ) {}

  async getCommandList(): Promise<GetCommandListDto> {
    return this.commandRepository.getCommandList();
  }

  async createCommand(
    createCommandDto: CreateCommandDto,
  ): Promise<CommandEntity> {
    return this.commandRepository.createCommand(createCommandDto);
  }

  async updateCommand(
    command: CommandEntity,
    updateCommandDto: UpdateCommandDto,
  ): Promise<void> {
    command.data = updateCommandDto.data;

    await command.save();
  }

  async deleteCommand(command: CommandEntity): Promise<void> {
    await command.remove();
  }
}
