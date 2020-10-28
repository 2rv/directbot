import { Service } from '../../type';
import { DirectModuleState } from './direct.module';

export class ChatService extends Service {
  module: DirectModuleState;

  async sendMessage(value: string) {
    const textField = await this.module.directPage.$('textarea');

    await textField.type(value);
    await textField.press('Enter');

    await this.module.directPage.waitFor(500);
  }

  async sendRequestMessage() {
    const textField = await this.module.requestPage.$('textarea');

    await textField.type('Этот аккаунт использует бота. Напишите /start');
    await textField.press('Enter');
    await this.module.requestPage.waitFor(500);
  }

  async openChatByDialogId(id: string) {
    const item = await this.module.directPage.$(`a[href="${id}"]`);

    await item.click();
    await this.module.directPage.waitFor(2000);
  }

  async getUserLastMessage() {
    const item = (
      await this.module.directPage.$$('div[style="min-height: 44px;"]')
    )[
      (await this.module.directPage.$$('div[style="min-height: 44px;"]'))
        .length - 1
    ];

    const textValue = await item.evaluate(elem => elem.textContent);
    return textValue;
  }

  async closeActiveChat() {
    const item = await this.module.directPage.$('a[href="/direct/inbox/"]');
    await item.click();
    await this.module.directPage.waitFor(1000);
  }

  async acceptUserChatRequest() {
    this.module.requestPage.click(
      'div[style="height: 50px;"] > div:last-of-type button',
    );
    await this.module.requestPage.waitFor(3000);
  }

  async openRequestByDialogId(id: string) {
    const item = await this.module.requestPage.$(`a[href="${id}"]`);

    await item.click();
    await this.module.requestPage.waitFor(2000);
  }
}
