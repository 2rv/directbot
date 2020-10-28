import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  ValidationPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CommandService } from './command.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { CommandEntity } from './command.entity';
import { GetCommandListDto } from './dto/get-command-list.dto';
import { CommandGuard } from './guard/command.guard';
import { GetCommand } from './decorator/get-shop.decorator';
import { UpdateCommandDto } from './dto/update-command.dto';

@Controller('command')
export class CommandController {
  constructor(private commandService: CommandService) {}

  @Post('/')
  async createCommand(
    @Body(ValidationPipe) createCommandDto: CreateCommandDto,
  ): Promise<CommandEntity> {
    return this.commandService.createCommand(createCommandDto);
  }

  @Get('/list')
  async getCommandList(): Promise<GetCommandListDto> {
    return this.commandService.getCommandList();
  }

  @Patch('/:commandId')
  @UseGuards(CommandGuard)
  async updateCommandItem(
    @GetCommand() command: CommandEntity,
    @Body(ValidationPipe) updateCommandDto: UpdateCommandDto,
  ): Promise<void> {
    return this.commandService.updateCommand(command, updateCommandDto);
  }

  @Delete('/:commandId')
  @UseGuards(CommandGuard)
  async deleteCommandItem(@GetCommand() command: CommandEntity): Promise<void> {
    return this.commandService.deleteCommand(command);
  }
}
