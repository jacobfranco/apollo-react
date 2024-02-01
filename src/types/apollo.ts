import {
    ApolloConfigRecord,
  } from 'src/normalizers';

type Me = string | null | false | undefined;
type ApolloConfig = ReturnType<typeof ApolloConfigRecord>;

export {
    Me,
    ApolloConfig
}