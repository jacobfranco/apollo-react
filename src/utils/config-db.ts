// TODO: Understand what is being done here, also implement the Policy maybe

import {
    Map as ImmutableMap,
    List as ImmutableList
  } from 'immutable';
  
  export type Config = ImmutableMap<string, any>;

  const find = (
    configs: ImmutableList<Config>,
    group: string,
    key: string,
  ): Config | undefined => {
    return configs.find(config =>
      config.isSuperset(ImmutableMap({ group, key })),
    );
  };
  
  export const ConfigDB = {
    find
  };
  
  export default ConfigDB;