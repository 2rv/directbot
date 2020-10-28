import { AccountEntity } from 'apps/api/src/core/account/account.entity';
import { PhoneCodeEntity } from 'apps/api/src/core/phone-code/phone-code.entity';
import { getRepository } from 'typeorm';

export class LoginRepository {
  async getAccountData(): Promise<AccountEntity> {
    return getRepository(AccountEntity).findOne();
  }

  async createPhoneCode(
    id: string,
    accountData: AccountEntity,
  ): Promise<PhoneCodeEntity> {
    const code = new PhoneCodeEntity();
    code.dataId = id;
    code.account = accountData;
    return code.save();
  }

  async waitForPhoneCodeValue(code: PhoneCodeEntity) {
    let codeValue = null;

    while (codeValue === null) {
      await new Promise(res => setTimeout(res, 5000));

      codeValue = await this.getCaptchaValueById(code.id);
    }

    return codeValue;
  }

  async getCaptchaValueById(id): Promise<string> {
    const code = await getRepository(PhoneCodeEntity).findOne({
      where: { id },
    });

    if (!code) {
      return null;
    }

    if (!code.value) {
      return null;
    }

    return code.value;
  }
}
