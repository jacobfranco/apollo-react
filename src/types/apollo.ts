import {
  ApolloConfigRecord,
  FooterItemRecord,
  PromoPanelItemRecord,
} from "src/normalizers/apollo";

type Me = string | null | false | undefined;
type ApolloConfig = ReturnType<typeof ApolloConfigRecord>;
type FooterItem = ReturnType<typeof FooterItemRecord>;
type PromoPanelItem = ReturnType<typeof PromoPanelItemRecord>;

export { type Me, type ApolloConfig, type FooterItem, type PromoPanelItem };
