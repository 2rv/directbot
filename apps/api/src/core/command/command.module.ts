import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandController } from './command.controller';
import { CommandEntity } from './command.entity';
import { CommandRepository } from './command.repository';
import { CommandService } from './command.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommandRepository, CommandEntity])],
  controllers: [CommandController],
  providers: [CommandService],
  exports: [],
})
export class CommandModule {}
