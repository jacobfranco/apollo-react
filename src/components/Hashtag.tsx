import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesCurve } from "react-sparklines";

import { shortNumberFormat } from "../utils/numbers";

import { HStack, Stack, Text } from "src/components";

import type { Tag } from "src/types/entities";

interface IHashtag {
  hashtag: Tag;
}

const Hashtag: React.FC<IHashtag> = ({ hashtag }) => {
  const count = Number(hashtag.history?.get(0)?.accounts);

  return (
    <HStack alignItems="center" justifyContent="between" data-testid="hashtag">
      <Stack>
        <Link to={`/tags/${hashtag.name}`} className="hover:underline">
          <Text tag="span" size="sm" weight="semibold">
            #{hashtag.name}
          </Text>
        </Link>

        {Boolean(count) && (
          <Text theme="muted" size="sm">
            <FormattedMessage
              id="trends.count_by_accounts"
              defaultMessage="{count} {rawCount, plural, one {person} other {people}} talking"
              values={{
                rawCount: count,
                count: <strong>{shortNumberFormat(count)}</strong>,
              }}
            />
          </Text>
        )}
      </Stack>

      {hashtag.history && (
        <div className="w-[40px]" data-testid="sparklines">
          <Sparklines
            width={40}
            height={28}
            data={hashtag.history
              .reverse()
              .map((day) => +day.uses)
              .toArray()}
          >
            <SparklinesCurve color="#A981FC" />
          </Sparklines>
        </div>
      )}
    </HStack>
  );
};

export default Hashtag;
