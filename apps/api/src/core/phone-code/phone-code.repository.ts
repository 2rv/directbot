import { Repository, EntityRepository } from 'typeorm';
import { PhoneCodeEntity } from './phone-code.entity';

@EntityRepository(PhoneCodeEntity)
export class PhoneCodeRepository extends Repository<PhoneCodeEntity> {}
