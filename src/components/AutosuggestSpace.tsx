import { useAppSelector } from "src/hooks/useAppSelector";
import { selectSpace } from "src/selectors";
import type { RootState } from "src/store";

interface Props {
  id: string;
}

const AutosuggestSpace: React.FC<Props> = ({ id }) => {
  const space = useAppSelector((state: RootState) => selectSpace(state, id));

  if (!space) return null;

  return (
    <div className="flex items-center">
      <div className="flex flex-col">
        <span className="font-medium">{space.get("name")}</span>
        <span className="text-gray-500 text-sm">s/{space.get("id")}</span>
      </div>
    </div>
  );
};

export default AutosuggestSpace;
