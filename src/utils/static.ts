/**
 * Static: functions related to static files.
 * @module src/utils/static
 */

import { join } from 'path-browserify';

import * as BuildConfig from 'src/build-config';

/** Gets the path to a file with build configuration being considered. */
export const joinPublicPath = (...paths: string[]): string => {
  return join(BuildConfig.FE_SUBDIRECTORY, ...paths);
};