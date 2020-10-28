import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { AccountEntity } from '../account/account.entity';

@Entity({ name: 'command' })
export class CommandEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trigger: string;

  @Column()
  data: string;

  @CreateDateColumn()
  createDate: string;

  @ManyToOne(
    type => AccountEntity,
    account => account.command,
    { eager: false },
  )
  account: AccountEntity;
}
