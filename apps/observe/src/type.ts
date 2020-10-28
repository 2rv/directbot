import { Path, PathProps } from './path';
import { AccountConfig, AccountProps } from './config/account.config';
import { Browser, Page } from 'puppeteer';

export interface ModuleProps {
  browser: Browser;
}

export interface ModuleState {
  browser: Browser;
  path: PathProps;
  config: {
    account: AccountProps;
  };
  page: Page | null;
}

export abstract class Module implements ModuleState {
  browser: Browser;
  page: Page;

  constructor(props: ModuleProps) {
    this.browser = props.browser;
  }

  path = Path;
  config = {
    account: AccountConfig,
  };

  abstract init(): Promise<void>;
}

export interface ServiceProps {
  browser: Browser;
  page: Page;
}

// tslint:disable-next-line: max-classes-per-file
export class Service {
  module: ModuleState;

  constructor(module: ModuleState) {
    this.module = module;
  }
}
