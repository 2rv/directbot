import path = require('path');
import fs = require('fs');
import { Logger } from '@nestjs/common';

export enum ErrorType {
  ACCOUNT_DATA_FOR_LOGIN_NOT_FOUND = 'ACCOUNT_DATA_FOR_LOGIN_NOT_FOUND',
  LOGIN_FORM_ERROR = 'LOGIN_FORM_ERROR',
}

export const catchAndlogError = page => async err => {
  Logger.debug(err);

  const name = new Date().toJSON();

  await page.setViewport({ width: 1024, height: 800 });

  page.screenshot({
    path: path.join(__dirname, `/../../../logs/${name}-image.png`),
    type: 'png',
    fullPage: true,
  });

  const html = await page.content();
  fs.writeFileSync(
    path.join(__dirname, `/../../../logs/${name}-html.html`),
    html,
  );

  const error = `${err.message}\n${err.stack}`;
  fs.writeFileSync(
    path.join(__dirname, `/../../../logs/${name}-error.txt`),
    error,
  );

  throw err;
};
