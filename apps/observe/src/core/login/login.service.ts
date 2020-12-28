import { AccountEntity } from 'apps/api/src/core/account/account.entity';
import { ErrorType } from '../../error';
import { Service } from '../../type';

export class LoginService extends Service {
  async fillLoginForm(accountData: AccountEntity) {
    await this.module.page.waitForSelector('input[name="username"]');
    await this.module.page.type('input[name="username"]', accountData.login);
    await this.module.page.waitFor(500);

    await this.module.page.type('input[name="password"]', accountData.password);
    await this.module.page.waitFor(500);

    await this.module.page.click('button[type="submit"]');

    try {
      await this.module.page.waitForNavigation({ timeout: 10000 });
    } catch {
      const error = await this.module.page.$eval(
        'p[role="alert"]',
        el => el.innerText,
      );

      throw new Error(error);
    }
  }

  async checkLogged() {
    const logged = await this.module.page.$('a[href="/explore/"]');
    return !!logged;
  }

  async fillPhoneGuardForm() {
    await this.module.page.click('form button');
  }

  async fillPhoneCodeForm(code: number) {
    await this.module.page.type('input', String(code));
    await this.module.page.waitFor(500);

    await this.module.page.click('form button');
    await this.module.page.waitForNavigation({ timeout: 10000 });
  }
}
