import { Path, PathProps } from './path';
import { AccountConfig, AccountProps } from './config/account.config';
import { Browser, Page } from 'puppeteer';

export interface ModuleProps {
  browser: Browser;
}

interface ModuleState {
  browser: Browser;
  path: PathProps;
  config: {
    account: AccountProps;
  };
  page: Page | null;
}

export class Module implements ModuleState {
  browser: Browser;
  page: Page;

  constructor(props: ModuleProps) {
    this.browser = props.browser;
  }

  path = Path;
  config = {
    account: AccountConfig,
  };
}

export interface ServiceProps {
  browser: Browser;
  page: Page;
}

export class Service {
  module: ModuleState;

  constructor(module: ModuleState) {
    this.module = module;
  }
}
