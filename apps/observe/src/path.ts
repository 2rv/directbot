export enum Path {
  LOGIN = 'https://www.instagram.com/accounts/login/?source=auth_switcher',
  DIRECT = 'https://www.instagram.com/direct/inbox/',
  REQUEST = 'https://www.instagram.com/direct/requests/',
}

export interface PathProps {
  LOGIN: string;
}
