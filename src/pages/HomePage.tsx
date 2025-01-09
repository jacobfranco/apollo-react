import clsx from "clsx";
import { useRef } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { uploadCompose } from "src/actions/compose";
import Avatar from "src/components/Avatar";
import { Card, CardBody } from "src/components/Card";
import HStack from "src/components/HStack";
import Layout from "src/components/Layout";
import LinkFooter from "src/features/LinkFooter";
import {
  WhoToFollowPanel,
  TrendsPanel,
  SignUpPanel,
  CtaBanner,
  TrendingSpacesPanel,
} from "src/features/AsyncComponents";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { useAppSelector } from "src/hooks/useAppSelector";
import { useDraggedFiles } from "src/hooks/useDraggedFiles";
import { useIsMobile } from "src/hooks/useIsMobile";
import { useOwnAccount } from "src/hooks/useOwnAccount";

import ComposeForm from "src/features/compose/components/ComposeForm";
import SidebarNavigation from "src/components/SidebarNavigation";

interface IHomePage {
  children: React.ReactNode;
}

const HomePage: React.FC<IHomePage> = ({ children }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const me = useAppSelector((state) => state.me);
  const { account } = useOwnAccount();

  const composeId = "home";
  const composeBlock = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { isDragging, isDraggedOver } = useDraggedFiles(
    composeBlock,
    (files) => {
      dispatch(uploadCompose(composeId, files, intl));
    }
  );

  const username = account ? account.username : "";
  const avatar = account ? account.avatar : "";

  return (
    <Layout>
      <Layout.Sidebar>
        <SidebarNavigation />
      </Layout.Sidebar>
      <Layout.Main
        className={clsx("black:space-y-0 dark:divide-gray-800", {
          "pt-3 sm:pt-0 space-y-3": !isMobile,
        })}
      >
        {me && (
          <Card
            className={clsx(
              "relative z-[1] border-gray-200 transition black:border-b black:border-gray-800 dark:border-gray-800",
              {
                "border-2 border-primary-600 border-dashed z-[99]": isDragging,
                "ring-2 ring-offset-2 ring-primary-600": isDraggedOver,
                "border-b": isMobile,
              }
            )}
            variant="rounded"
            ref={composeBlock}
          >
            <CardBody>
              <HStack alignItems="start" space={4}>
                <Link to={`/@${username}`}>
                  <Avatar src={avatar} size={46} />
                </Link>

                <div className="w-full translate-y-0.5">
                  <ComposeForm
                    id={composeId}
                    shouldCondense
                    autoFocus={false}
                    clickableAreaRef={composeBlock}
                  />
                </div>
              </HStack>
            </CardBody>
          </Card>
        )}

        {children}

        {!me && <CtaBanner />}
      </Layout.Main>

      <Layout.Aside>
        {!me && <SignUpPanel />}
        <TrendsPanel limit={5} />
        <TrendingSpacesPanel limit={3} />
        <WhoToFollowPanel limit={3} />

        <LinkFooter />
      </Layout.Aside>
    </Layout>
  );
};

export default HomePage;
