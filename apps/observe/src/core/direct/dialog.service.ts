import { Service } from '../../type';
import { DirectModuleState } from './direct.module';

export class DialogService extends Service {
  module: DirectModuleState;

  async getUnreadDialogLinks() {
    const directUserLinks = await this.module.directPage.$$eval('a', items =>
      items
        .filter(link => {
          if (link.getAttribute('href').search('/direct/t/') === -1) {
            return false;
          }
          if (link.children[0].childElementCount !== 3) {
            return false;
          }

          if (
            link.children[0].children[1].children[1].children[0].children[0].children[0].children[0].innerText.match(
              /^\//,
            ) === null
          ) {
            return false;
          }

          return true;
        })
        .map(link => link.getAttribute('href')),
    );

    if (directUserLinks.length === 0) {
      return null;
    }

    return directUserLinks;
  }

  async getRequestDialogLinks() {
    const requestUserLinks = await this.module.requestPage.$$eval('a', items =>
      items
        .filter(link => {
          if (link.getAttribute('href').search('/direct/t/') === -1) {
            return false;
          }

          return true;
        })
        .map(link => link.getAttribute('href')),
    );

    if (requestUserLinks.length === 0) {
      return null;
    }

    return requestUserLinks;
  }

  async reloadDirectUserLinks() {
    await this.module.directPage.click('a[href="/"]');
    await this.module.directPage.waitFor(1000);
    await this.module.directPage.click('a[href="/direct/inbox/"]');
    await this.module.directPage.waitFor(1000);
  }
}
