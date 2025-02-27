import clsx from "clsx";
import { throttle } from "es-toolkit";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Helmet from "src/components/Helmet";
import { useApolloConfig } from "src/hooks/useApolloConfig";

import { Card, CardBody, CardHeader, CardTitle, type CardSizes } from "./Card";

type IColumnHeader = Pick<
  IColumn,
  "label" | "backHref" | "className" | "action"
>;

/** Contains the column title with optional back button. */
const ColumnHeader: React.FC<IColumnHeader> = ({
  label,
  backHref,
  className,
  action,
}) => {
  const history = useHistory();

  const handleBackClick = () => {
    if (backHref) {
      history.push(backHref);
      return;
    }

    if (history.length === 1) {
      history.push("/");
    } else {
      history.goBack();
    }
  };

  return (
    <CardHeader className={className} onBackClick={handleBackClick}>
      <CardTitle title={label} />

      {action && <div className="flex grow justify-end">{action}</div>}
    </CardHeader>
  );
};

export interface IColumn {
  /** Route the back button goes to. */
  backHref?: string;
  /** Column title text. */
  label?: string;
  /** Whether this column should have a transparent background. */
  transparent?: boolean;
  /** Whether this column should have a title and back button. */
  withHeader?: boolean;
  /** Extra class name for top <div> element. */
  className?: string;
  /** Extra class name for the <CardBody> element. */
  bodyClassName?: string;
  /** Ref forwarded to column. */
  ref?: React.Ref<HTMLDivElement>;
  /** Children to display in the column. */
  children?: React.ReactNode;
  /** Action for the ColumnHeader, displayed at the end. */
  action?: React.ReactNode;
  /** Column size, inherited from Card. */
  size?: CardSizes;
}

/** A backdrop for the main section of the UI. */
const Column = forwardRef<HTMLDivElement, IColumn>(
  (props, ref): JSX.Element => {
    const {
      backHref,
      children,
      label,
      transparent = false,
      withHeader = true,
      className,
      bodyClassName,
      action,
      size,
    } = props;
    const apolloConfig = useApolloConfig();
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = useCallback(
      throttle(() => {
        setIsScrolled(window.pageYOffset > 32);
      }, 50),
      []
    );

    useEffect(() => {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
      <div
        role="region"
        className="relative"
        ref={ref}
        aria-label={label}
        column-type={transparent ? "transparent" : "filled"}
      >
        <Helmet>
          <title>{label}</title>

          {apolloConfig.appleAppId && (
            <meta
              data-react-helmet="true"
              name="apple-itunes-app"
              content={`app-id=${apolloConfig.appleAppId}, app-argument=${location.href}`}
            />
          )}
        </Helmet>

        <Card
          size={size}
          variant={transparent ? undefined : "rounded"}
          className={className}
        >
          {withHeader && (
            <ColumnHeader
              label={label}
              backHref={backHref}
              className={clsx({
                "rounded-t-3xl": !isScrolled && !transparent,
                "sticky top-12 z-10 bg-transprent dark:bg-transparent black:bg-black/90 lg:top-16":
                  !transparent,
                "p-4 sm:p-0 sm:pb-4 black:p-4": transparent,
                "-mt-4 p-4": size !== "lg" && !transparent,
                "-mt-4 p-4 sm:-mt-6 sm:-mx-6 sm:p-6":
                  size === "lg" && !transparent,
              })}
              action={action}
            />
          )}
          <CardBody className={bodyClassName}>{children}</CardBody>
        </Card>
      </div>
    );
  }
);

export { Column, ColumnHeader };
