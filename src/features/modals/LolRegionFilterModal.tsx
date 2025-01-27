import React, { useState, useEffect } from "react";
import { Modal } from "src/components";
import { closeModal } from "src/actions/modals";
import { useAppDispatch } from "src/hooks";
import Button from "src/components/Button";
import { groupLeaguesByTier } from "src/teams";
import KVStore from "src/storage/kv-store";

interface LolRegionFilterModalProps {
  onApplyFilter: (selectedLeagues: string[]) => void;
  initialSelections?: string[];
}

const LolRegionFilterModal: React.FC<LolRegionFilterModalProps> = ({
  onApplyFilter,
  initialSelections = [],
}) => {
  const dispatch = useAppDispatch();
  const [selectedLeagues, setSelectedLeagues] =
    useState<string[]>(initialSelections);
  const groupedLeagues = groupLeaguesByTier();

  useEffect(() => {
    const loadPersistedSelections = async () => {
      const persistedLeagues = await KVStore.getItem("selectedLeagues");
      if (Array.isArray(persistedLeagues)) {
        setSelectedLeagues(persistedLeagues);
      }
    };

    loadPersistedSelections().catch(() => {
      // Handle errors as needed if retrieval fails.
    });
  }, []);

  const handleLeagueToggle = (leagueKey: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(leagueKey)
        ? prev.filter((l) => l !== leagueKey)
        : [...prev, leagueKey]
    );
  };

  const handleApplyFilter = async () => {
    onApplyFilter(selectedLeagues);
    await KVStore.setItem("selectedLeagues", selectedLeagues);
    dispatch(closeModal());
  };

  const handleClearFilters = async () => {
    setSelectedLeagues([]);
    await KVStore.removeItem("selectedLeagues");
  };

  return (
    <Modal
      title="Filter by League"
      onClose={() => dispatch(closeModal())}
      width="4xl"
    >
      <div className="p-4 max-w-screen-lg mx-auto">
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((tier) => (
            <div key={tier} className="flex flex-col space-y-4">
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

export default LolRegionFilterModal;
