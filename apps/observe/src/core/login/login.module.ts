import { Module } from '../../type';

import { LoginService } from './login.service';

export class LoginModule extends Module {
  loginService: LoginService;

  constructor(props) {
    super(props);
    this.loginService = new LoginService(this);
  }

  async login() {
    this.page = await this.browser.newPage();

    await this.page.goto(this.path.LOGIN, { waitUntil: 'networkidle2' });
    await this.loginService.login();
  }
}
