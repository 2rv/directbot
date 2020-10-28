import { Logger } from '@nestjs/common';
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
  logger: Logger;

  constructor(props) {
    super(props);
    this.loginService = new LoginService(this);
    this.popupService = new PopupService(this);
    this.loginRepository = new LoginRepository();
    this.logger = new Logger('Login Module');
  }

  async init(): Promise<void> {
    this.logger.log('Starting login');
    await this.login();

    this.logger.log('Starting close coockie popup');
    await this.popupService.closeCoockiePopup();
    this.logger.log('End close coockie popup');

    this.logger.log('Starting solve phone guard');
    await this.solvePhoneGuard();
    this.logger.log('End solve phone guard');

    this.logger.log('Starting close dialog popup');
    await this.popupService.closeDialogPopup();
    this.logger.log('End close dialog popup');

    await this.closeLogin();
    this.logger.log('Ended login');
  }

  async login() {
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
      this.logger.error(error);
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
