import React, { useState } from "react";
import { Modal } from "src/components";
import { closeModal } from "src/actions/modals";
import { useAppDispatch } from "src/hooks";
import Button from "src/components/Button";
import { teamData } from "src/teams";

interface FilterModalProps {
  onApplyFilter: (selectedLeagues: string[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onApplyFilter }) => {
  const dispatch = useAppDispatch();
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  // Extract unique leagues from teamData
  const leagues = Array.from(
    new Set(
      Object.values(teamData)
        .map((data) => data.league)
        .filter(
          (league): league is string =>
            league !== undefined && league !== "Unknown"
        )
    )
  );

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

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal
      title="Filter by League"
      onClose={handleClose}
      confirmationAction={handleApplyFilter}
      confirmationText="Apply Filter"
      cancelAction={handleClose}
      cancelText="Cancel"
    >
      <div className="space-y-4">
        {/* Leagues Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Leagues</h3>
          <div className="space-y-2">
            {leagues.map((league) => (
              <Button
                key={league}
                onClick={() => handleLeagueToggle(league)}
                theme={
                  selectedLeagues.includes(league) ? "primary" : "secondary"
                }
                block
              >
                {league}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
