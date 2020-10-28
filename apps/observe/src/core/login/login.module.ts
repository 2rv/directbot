import { AccountEntity } from 'apps/api/src/core/account/account.entity';
import { PhoneCodeEntity } from 'apps/api/src/core/phone-code/phone-code.entity';
import { getRepository } from 'typeorm';
import { ErrorType } from '../../error';
import { Module } from '../../type';
import { LoginRepository } from './login.repository';

import { LoginService } from './login.service';
import { PopupService } from './popup.service';

export class LoginModule extends Module {
  loginService: LoginService;
  accountData: AccountEntity;
  loginRepository: LoginRepository;
  popupService: PopupService;

  constructor(props) {
    super(props);
    this.loginService = new LoginService(this);
    this.popupService = new PopupService(this);
    this.loginRepository = new LoginRepository();
  }

  async init(): Promise<void> {
    await this.login();
    await this.popupService.closeCoockiePopup();
    await this.solvePhoneGuard();
    await this.popupService.closeDialogPopup();
    await this.closeLogin();
  }

  async login() {
    const pageFisrt = await this.browser.newPage();
    await pageFisrt.goto(this.path.LOGIN, { waitUntil: 'load' });
    await pageFisrt.waitFor(500);

    this.page = await this.browser.newPage();

    await this.page.goto(this.path.LOGIN, { waitUntil: 'load' });
    await this.page.waitFor(500);

    this.accountData = await this.loginRepository.getAccountData();

    if (!this.accountData) {
      throw new Error(ErrorType.ACCOUNT_DATA_FOR_LOGIN_NOT_FOUND);
    }

    try {
      await this.loginService.fillLoginForm(this.accountData);
    } catch (error) {
      console.log(error);
      throw new Error(ErrorType.LOGIN_FORM_ERROR);
    }
  }

  async solvePhoneGuard() {
    const url = this.page.url().split('/');
    const page = url[3];
    const codeHash = url[5];

    if (page !== 'challenge') {
      return null;
    }

    await this.loginService.fillPhoneGuardForm();

    const code = await this.loginRepository.createPhoneCode(
      codeHash,
      this.accountData,
    );

    const codeValue = await this.loginRepository.waitForPhoneCodeValue(code);

    await this.loginService.fillPhoneCodeForm(codeValue);
  }

  async closeLogin() {
    await this.page.close();
  }
}
