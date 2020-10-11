import { Service } from '../../type';

export class LoginService extends Service {
  async login() {
    await this.module.page.setCookie({
      name: 'sessionid',
      value: this.module.config.account.session,
    });
  }
}
