import { Service } from '../../type';

export class ChatService extends Service {
  async sendMessage(value: string) {
    const textField = await this.module.page.$('textarea');

    await textField.type(value);
    await textField.press('Enter');
  }

  async openChatByDialogId(id: string) {
    const item = await this.module.page.$(`a[href="${id}"]`);

    await item.click();
    await this.module.page.waitFor(2000);
  }

  async getUserLastMessage() {
    const item = (await this.module.page.$$('div[style="min-height: 44px;"]'))[
      (await this.module.page.$$('div[style="min-height: 44px;"]')).length - 1
    ];

    const textValue = await item.evaluate((elem) => elem.textContent);
    return textValue;
  }
}
