import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { AccountEntity } from '../account/account.entity';

@Entity({ name: 'phone_code' })
export class PhoneCodeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: false })
  dataId: string;

  @CreateDateColumn()
  createDate: string;

  @ManyToOne(
    type => AccountEntity,
    account => account.dialog,
    { eager: false },
  )
  account: AccountEntity;
}
