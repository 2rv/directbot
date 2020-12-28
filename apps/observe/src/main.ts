import { LoginModule } from './core/login/login.module';
import { DirectModule } from './core/direct/direct.module';

import * as Puppeteer from 'puppeteer';
import { initDatabaseConnection } from './database';

async function bootstrap() {
  await initDatabaseConnection();
  const browser = await Puppeteer.launch({
    headless: process.env.NODE_ENV === 'production',
    args: [
      '--no-sandbox',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36 1',
      '--user-data-dir=/tmp/user_data/',
      '--window-size=1200,800',
    ],
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
