import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CommandEntity } from '../command/command.entity';
import { DialogEntity } from '../dialog/dialog.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  session: string;

  @CreateDateColumn()
  createDate: string;

  @OneToMany(
    type => DialogEntity,
    dialogEntity => dialogEntity.user,
    {
      eager: false,
    },
  )
  dialog: DialogEntity;

  @OneToMany(
    type => CommandEntity,
    commandEntity => commandEntity.user,
    {
      eager: false,
    },
  )
  command: CommandEntity;
}
