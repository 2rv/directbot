import { CommandEntity } from 'apps/api/src/core/command/command.entity';
import { DialogEntity } from 'apps/api/src/core/dialog/dialog.entity';
import { getRepository } from 'typeorm';

export class DirectRepository {
  async getCommandList(): Promise<CommandEntity[]> {
    return getRepository(CommandEntity).find();
  }

  async createUserDialog(id: string): Promise<void> {
    const dialog = new DialogEntity();
    dialog.dialog = id;
    await dialog.save();
  }
}
