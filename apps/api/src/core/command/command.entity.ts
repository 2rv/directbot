import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'command' })
export class CommandEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  triger: string;

  @Column()
  value: string;

  @CreateDateColumn()
  createDate: string;

  @ManyToOne(
    type => UserEntity,
    user => user.command,
    { eager: false },
  )
  user: UserEntity;
}
