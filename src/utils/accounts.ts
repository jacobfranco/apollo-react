import type { Account } from 'src/schemas';

/** Default header filenames */
const DEFAULT_HEADERS: string[] = [
    require('src/assets/images/header-missing.png'), // TODO: Implement
  ];
  
  /** Check if the avatar is a default avatar */
  export const isDefaultHeader = (url: string) => {
    return DEFAULT_HEADERS.some(header => url.endsWith(header));
  };

/** Default avatar filenames */
const DEFAULT_AVATARS = [
    require('src/assets/images/avatar-missing.png'), // TODO: Implement
  ];
  
  /** Check if the avatar is a default avatar */
  export const isDefaultAvatar = (url: string) => {
    return DEFAULT_AVATARS.some(avatar => url.endsWith(avatar));
  };

  