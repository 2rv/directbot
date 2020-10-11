import { LoginModule } from './core/login/login.module';
import { DirectModule } from './core/direct/direct.module';

import * as Puppeteer from 'puppeteer';
import { initDatabaseConnection } from './database';

async function bootstrap() {
  await initDatabaseConnection();
  const browser = await Puppeteer.launch({
    headless: true,
    args: [
      '--disable-web-security',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-extensions',
    ],
  });
  const moduleProps = { browser };
  await new LoginModule(moduleProps).login();
  const directModule = new DirectModule(moduleProps);
  await directModule.observe();
}

bootstrap();
