import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'dialog' })
export class DialogEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  dialog: string;

  @Column({ nullable: false })
  nickname: string;

  @CreateDateColumn()
  createDate: string;

  @ManyToOne(
    type => UserEntity,
    user => user.dialog,
    { eager: false },
  )
  user: UserEntity;
}
