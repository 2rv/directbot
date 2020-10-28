import { CommandEntity } from 'apps/api/src/core/command/command.entity';
import { Module, ModuleState } from '../../type';

import { ChatService } from './chat.service';
import { DialogService } from './dialog.service';
import { DirectRepository } from './direct.repository';

export interface DirectModuleState extends ModuleState {
  directPage: any;
  requestPage: any;
}
export class DirectModule extends Module {
  unreadDialogLinks: string[];
  lastMessage: string;
  chatService: ChatService;
  dialogService: DialogService;
  command: CommandEntity[];
  directRepository: DirectRepository;
  unreadRequestLinks: string[];
  directPage: any;
  requestPage: any;

  constructor(props) {
    super(props);

    this.chatService = new ChatService(this);
    this.dialogService = new DialogService(this);
    this.directRepository = new DirectRepository();
  }

  async init() {
    await this.getCommandList();

    await this.openDirect();
    await this.openRequest();

    this.observe();
  }

  async observe() {
    for (;;) {
      for (let y = 0; y < 5; y++) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.checkRequest();

        await this.directPage.bringToFront();

        await new Promise(resolve => setTimeout(resolve, 1000));

        for (let i = 0; i < 5; i++) {
          await this.checkDirect();
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.reloadDirect();
    }
  }

  async checkDirect() {
    await this.getDirectUserLinks();
    if (this.unreadDialogLinks) {
      const { unreadDialogLinks } = this;

      if (!unreadDialogLinks) {
        return null;
      }

      for (const index in unreadDialogLinks) {
        await this.chatService.openChatByDialogId(unreadDialogLinks[index]);
        const msg = await this.chatService.getUserLastMessage();
        await this.answearMessage(msg);
        await this.chatService.closeActiveChat();
      }
    }
  }

  async checkRequest() {
    await this.requestPage.bringToFront();
    await this.requestPage.reload();

    await this.getRequestUserLinks();
    if (this.unreadRequestLinks) {
      const { unreadRequestLinks } = this;

      if (!unreadRequestLinks) {
        return null;
      }

      for (const index in unreadRequestLinks) {
        await this.chatService.openRequestByDialogId(unreadRequestLinks[index]);
        await this.chatService.acceptUserChatRequest();
        await this.directRepository.createUserDialog(
          unreadRequestLinks[index].split('/')[3],
        );
        await this.answearRequestMessage();
        await this.requestPage.goBack();
      }
    }
  }

  async openDirect() {
    this.directPage = await this.browser.newPage();

    await this.directPage.goto(this.path.DIRECT, { waitUntil: 'load' });
    await this.directPage.waitFor(2000);
  }

  async reloadDirect() {
    await this.directPage.reload(this.path.DIRECT, { waitUntil: 'load' });
    await this.directPage.waitFor(2000);
  }

  async openRequest() {
    this.requestPage = await this.browser.newPage();
    await this.requestPage.goto(this.path.REQUEST, {
      waitUntil: 'load',
    });
    await this.requestPage.waitFor(2000);
  }

  async getDirectUserLinks() {
    this.unreadDialogLinks = await this.dialogService.getUnreadDialogLinks();
  }

  async getRequestUserLinks() {
    this.unreadRequestLinks = await this.dialogService.getRequestDialogLinks();
  }

  async answearMessage(text: string) {
    if (!text.match(/^\//)) {
      return null;
    }

    const trigger = text.substr(1);

    let commandId = this.command.findIndex(i => i.trigger === trigger);

    if (commandId === -1) {
      commandId = this.command.findIndex(i => i.trigger === 'старт');
    }

    try {
      const { data } = this.command[commandId];
      await this.chatService.sendMessage(data);
    } catch {}
  }

  async answearRequestMessage() {
    await this.chatService.sendRequestMessage();
  }

  async getCommandList() {
    this.command = await this.directRepository.getCommandList();

    setInterval(async () => {
      this.command = await this.directRepository.getCommandList();
    }, 1000 * 60 * 30);
  }
}
