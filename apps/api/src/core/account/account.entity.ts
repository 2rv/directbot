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

@Entity({ name: 'account' })
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createDate: string;

  @OneToMany(
    type => DialogEntity,
    dialogEntity => dialogEntity.account,
    {
      eager: false,
    },
  )
  dialog: DialogEntity;

  @OneToMany(
    type => CommandEntity,
    commandEntity => commandEntity.account,
    {
      eager: false,
    },
  )
  command: CommandEntity;
}
