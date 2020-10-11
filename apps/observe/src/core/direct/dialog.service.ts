import { Service } from '../../type';

export class DialogService extends Service {
  async getUnreadDialogLinks() {
    const directUserLinks = await this.module.page.$$eval('a', (items) =>
      items
        .filter((link) => {
          if (link.getAttribute('href').search('/direct/t/') === -1) {
            return false;
          }
          if (link.children[0].childElementCount !== 3) {
            return false;
          }

          return true;
        })
        .map((link) => link.getAttribute('href')),
    );

    if (directUserLinks.length === 0) {
      return null;
    }

    return directUserLinks;
  }
}
