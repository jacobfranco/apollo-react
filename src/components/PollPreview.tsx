import PollOption from "src/components/PollOption";
import Stack from "src/components/Stack";
import { useAppSelector } from "src/hooks/useAppSelector";
import { Poll as PollEntity } from "src/types/entities";

interface IPollPreview {
  pollId: string;
}

const PollPreview: React.FC<IPollPreview> = ({ pollId }) => {
  const poll = useAppSelector((state) => state.polls.get(pollId) as PollEntity);

  if (!poll) {
    return null;
  }

  return (
    <Stack space={2}>
      {poll.options.map((option, i) => (
        <PollOption
          key={i}
          poll={poll}
          option={option}
          index={i}
          showResults={false}
          active={false}
          onToggle={() => {}}
        />
      ))}
    </Stack>
  );
};

export default PollPreview;
