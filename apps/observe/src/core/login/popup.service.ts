import { Service } from '../../type';

export class PopupService extends Service {
  async closeDialogPopup() {
    const diaglogButton = await this.module.page.$(
      'div[role="dialog"] > div > div > div:last-of-type > button:last-of-type',
    );

    if (diaglogButton) {
      await diaglogButton.click();
      await this.module.page.waitFor(1000);
    }
  }

  async closeCoockiePopup() {
    const diaglogButton = await this.module.page.$(
      'div[role="dialog"] > div > div > div:last-of-type > button',
    );

    if (diaglogButton) {
      await diaglogButton.click();
      await this.module.page.waitFor(1000);
    }
  }
}
