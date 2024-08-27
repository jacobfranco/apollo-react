import type { Account } from 'src/schemas';

import avatarMissing from 'src/assets/images/avatar-missing.png';
import headerMissing from 'src/assets/images/header-missing.png';


/** Default header filenames */
const DEFAULT_HEADERS: string[] = [
  headerMissing // TODO: Implement
];

/** Check if the avatar is a default avatar */
export const isDefaultHeader = (url: string) => {
  return DEFAULT_HEADERS.some(header => url.endsWith(header));
};

/** Default avatar filenames */
const DEFAULT_AVATARS = [
  avatarMissing, // TODO: Implement
];

/** Check if the avatar is a default avatar */
export const isDefaultAvatar = (url: string) => {
  return DEFAULT_AVATARS.some(avatar => url.endsWith(avatar));
};

