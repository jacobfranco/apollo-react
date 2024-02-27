import {
    ApolloConfigRecord,
    FooterItemRecord,
  } from 'src/normalizers/apollo';

type Me = string | null | false | undefined;
type ApolloConfig = ReturnType<typeof ApolloConfigRecord>;
type FooterItem = ReturnType<typeof FooterItemRecord>;

export {
    Me,
    ApolloConfig,
    FooterItem,
}