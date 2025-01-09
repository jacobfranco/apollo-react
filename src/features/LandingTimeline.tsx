import { SiteBanner } from "src/components";
import { Column } from "src/components/Column";

const LandingTimeline = () => {
  return (
    <Column transparent withHeader={false}>
      <div className="my-12 mb-16 px-4 sm:mb-20">
        <SiteBanner />
      </div>
    </Column>
  );
};

export default LandingTimeline;
