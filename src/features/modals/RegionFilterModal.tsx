import React, { useState } from "react";
import { Modal } from "src/components";
import { closeModal } from "src/actions/modals";
import { useAppDispatch } from "src/hooks";
import Button from "src/components/Button";
import { groupLeaguesByTier } from "src/teams";

interface RegionFilterModalProps {
  onApplyFilter: (selectedLeagues: string[]) => void;
  initialSelections?: string[];
}

const RegionFilterModal: React.FC<RegionFilterModalProps> = ({
  onApplyFilter,
  initialSelections = [],
}) => {
  const dispatch = useAppDispatch();
  const [selectedLeagues, setSelectedLeagues] =
    useState<string[]>(initialSelections);
  const groupedLeagues = groupLeaguesByTier();

  const handleLeagueToggle = (leagueKey: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(leagueKey)
        ? prev.filter((l) => l !== leagueKey)
        : [...prev, leagueKey]
    );
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedLeagues);
    dispatch(closeModal());
  };

  const handleClearFilters = () => {
    setSelectedLeagues([]);
  };

  return (
    <Modal title="Filter by League" onClose={() => dispatch(closeModal())}>
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((tier) => (
            <div key={tier} className="flex flex-col space-y-2">
              {groupedLeagues[tier as keyof typeof groupedLeagues].map(
                (league) => (
                  <Button
                    key={league}
                    onClick={() => handleLeagueToggle(league)}
                    theme={
                      selectedLeagues.includes(league) ? "primary" : "secondary"
                    }
                    className="w-full text-left text-sm"
                  >
                    {league}
                  </Button>
                )
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            onClick={handleClearFilters}
            theme="secondary"
            className="text-sm"
          >
            Clear Filters
          </Button>
          <div className="space-x-4">
            <Button
              onClick={() => dispatch(closeModal())}
              theme="secondary"
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilter}
              theme="primary"
              className="text-sm"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RegionFilterModal;
