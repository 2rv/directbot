import { Logger } from '@nestjs/common';
import { CommandEntity } from 'apps/api/src/core/command/command.entity';
import { catchAndlogError } from '../../error';
import { Module, ModuleState } from '../../type';
import { PopupService } from '../login/popup.service';

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
  popupService: PopupService;
  logger: Logger;

  constructor(props) {
    super(props);

    this.chatService = new ChatService(this);
    this.popupService = new PopupService(this);
    this.dialogService = new DialogService(this);
    this.directRepository = new DirectRepository();
    this.logger = new Logger('Direct Module');
  }

  async init() {
    this.logger.log('Starting get command list');
    await this.getCommandList();
    this.logger.log('End get command list');

    this.logger.log('Starting open direct');
    await this.openDirect();
    this.logger.log('Ended open direct');

    this.logger.log('Starting close dialog popup');
    await this.popupService.closeDialogPopup();
    this.logger.log('End close dialog popup');

    this.logger.log('Starting open request');
    await this.openRequest();
    this.logger.log('Ended open request');

    this.observe();
  }

  async observe() {
    this.logger.log('Starting observe');

    for (;;) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      await this.checkRequest();

      await this.directPage.bringToFront();

      await new Promise(resolve => setTimeout(resolve, 1000));

      for (let y = 0; y < 5; y++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.logger.log('Starting reopen direct');
        await this.dialogService.reloadDirectUserLinks();
        this.logger.log('End reopen direct');

        for (let i = 0; i < 25; i++) {
          await this.checkDirect();
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }

      await this.reloadDirect();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async checkDirect() {
    this.logger.log('Starting check direct');

    this.logger.log('Starting get direct user link');
    await this.getDirectUserLinks();
    this.logger.log('End get direct user link');
    if (this.unreadDialogLinks) {
      const { unreadDialogLinks } = this;

      if (!unreadDialogLinks) {
        return null;
      }

      for (const index in unreadDialogLinks) {
        this.logger.log('Open chat by dialog');
        await this.chatService.openChatByDialogId(unreadDialogLinks[index]);
        this.logger.log('Get user last message');
        const msg = await this.chatService.getUserLastMessage();
        this.logger.log('Answear message');
        await this.answearMessage(msg);
        this.logger.log('Close active chat');
        await this.chatService.closeActiveChat();
      }
    }
    this.logger.log('Ended check direct');
  }

  async checkRequest() {
    this.logger.log('Starting check request');

    await this.requestPage.bringToFront();
    this.logger.log('Reload page request');

    await this.requestPage.reload();
    await this.directPage.waitFor(2000);

    this.logger.log('Starting get request user links');
    await this.getRequestUserLinks();
    this.logger.log('Ended get request user links');

    if (this.unreadRequestLinks) {
      const { unreadRequestLinks } = this;

      if (!unreadRequestLinks) {
        return null;
      }

      for (const index in unreadRequestLinks) {
        this.logger.log('Open request chat');
        await this.chatService.openRequestByDialogId(unreadRequestLinks[index]);
        this.logger.log('Accept request chat');
        await this.chatService.acceptUserChatRequest();
        this.logger.log('Create user dialog');
        await this.directRepository.createUserDialog(
          unreadRequestLinks[index].split('/')[3],
        );
        this.logger.log('Answear request message');
        await this.answearRequestMessage();
        await this.requestPage.goBack();
      }
    }

    this.logger.log('End check request');
  }

  async openDirect() {
    this.directPage = await this.browser.newPage();
    this.page = this.directPage;

    this.directPage.on('error', catchAndlogError(this.directPage));
    this.directPage.on('pageerror', catchAndlogError(this.directPage));

    await this.directPage.goto(this.path.DIRECT, { waitUntil: 'load' });
    await this.directPage.waitFor(2000);
  }

  async reloadDirect() {
    await this.directPage.reload();
    await this.directPage.waitFor(2000);
  }

  async openRequest() {
    this.requestPage = await this.browser.newPage();

    this.requestPage.on('error', catchAndlogError(this.requestPage));
    this.requestPage.on('pageerror', catchAndlogError(this.requestPage));

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

    const { data } = this.command[commandId];
    await this.chatService.sendMessage(data);
  }

  async answearRequestMessage() {
    await this.chatService.sendRequestMessage();
  }

  async getCommandList() {
    this.command = await this.directRepository.getCommandList();

    setInterval(async () => {
      this.logger.log('Starting update command list');
      this.command = await this.directRepository.getCommandList();
      this.logger.log('End update command list');
    }, 1000 * 60 * 30);
  }
}
