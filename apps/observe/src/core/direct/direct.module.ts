import { Module } from '../../type';

import { PopupService } from '../popup/popup.service';
import { ChatService } from './chat.service';
import { DialogService } from './dialog.service';

export class DirectModule extends Module {
  unreadDialogLinks: string[];
  lastMessage: string;

  popupServie: PopupService;
  chatService: ChatService;
  dialogService: DialogService;

  constructor(props) {
    super(props);

    this.popupServie = new PopupService(this);
    this.chatService = new ChatService(this);
    this.dialogService = new DialogService(this);
  }

  async openDirect() {
    this.page = await this.browser.newPage();

    await this.page.goto(this.path.DIRECT, { waitUntil: 'load' });
    await this.page.waitFor(2000);

    await this.popupServie.closeDialogPopup();
  }

  async getDirectUserLinks() {
    this.unreadDialogLinks = await this.dialogService.getUnreadDialogLinks();
  }

  async openUserChat() {
    const { unreadDialogLinks } = this;

    if (unreadDialogLinks) {
      await this.chatService.openChatByDialogId(unreadDialogLinks[0]);
    }
  }

  async checkUserMessage() {
    const textValue = await this.chatService.getUserLastMessage();

    this.lastMessage = textValue;
  }

  async sendMessage() {
    await this.chatService.sendMessage('Hello world');
  }

  async reloadDirectPage() {
    await this.page.goto(this.path.DIRECT, { waitUntil: 'load' });
    await this.page.waitFor(2000);
  }

  async observe() {
    await this.openDirect();
    await this.getDirectUserLinks();

    if (this.unreadDialogLinks) {
      await this.reloadDirectPage();
      await this.openUserChat();
      await this.checkUserMessage();
      await this.sendMessage();
    }

    // setInterval(async () => {
    //   await this.getDirectUserLinks();
    // if (this.unreadDialogLinks) {
    //   await this.reloadDirectPage();
    //   await this.openUserChat();
    //   await this.checkUserMessage();
    //   await this.sendMessage();
    // }
    // }, 10000);
  }
}
