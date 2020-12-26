import { LoginModule } from './core/login/login.module';
import { DirectModule } from './core/direct/direct.module';

import * as Puppeteer from 'puppeteer';
import { initDatabaseConnection } from './database';

async function bootstrap() {
  await initDatabaseConnection();
  const browser = await Puppeteer.launch({
    headless: process.env.NODE_ENV === 'production',
    args: ['--no-sandbox'],
  });
  const moduleProps = { browser };

  try {
    await new LoginModule(moduleProps).init();
    await new DirectModule(moduleProps).init();
  } catch (e) {
    throw e;
  }
}

bootstrap();
