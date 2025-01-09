import DOMPurify from "isomorphic-dompurify";

import Markup from "src/components/Markup";
import Stack from "src/components/Stack";
import { getTextDirection } from "src/utils/rtl";

import { LogoText } from "src/components/LogoText";

const SiteBanner: React.FC = () => {
  const description = DOMPurify.sanitize("Landing page under construction");

  return (
    <Stack space={4}>
      <LogoText>Apollo</LogoText>

      <Markup
        size="lg"
        direction={getTextDirection(description)}
        html={{ __html: description }}
      />
    </Stack>
  );
};

export { SiteBanner };
