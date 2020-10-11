import * as config from 'config';

const accountConfig = config.get('ACCOUNT');

export const AccountConfig = {
  session: accountConfig.SESSION,
};

export interface AccountProps {
  session: string;
}
