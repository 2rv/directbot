export enum Path {
  LOGIN = 'https://www.instagram.com/accounts/login/?next=%2Flogin%2F&source=desktop_nav',
  DIRECT = 'https://www.instagram.com/direct/inbox/',
  REQUEST = 'https://www.instagram.com/direct/requests/',
}

export interface PathProps {
  LOGIN: string;
}
