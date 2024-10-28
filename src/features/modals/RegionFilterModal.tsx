// src/components/RegionFilterModal.tsx
import React, { useState } from "react";
import { Modal } from "src/components";
import { closeModal } from "src/actions/modals";
import { useAppDispatch } from "src/hooks";
import Button from "src/components/Button";
import { mainRegions } from "src/regions";

interface RegionFilterModalProps {
  onApplyFilter: (selectedMainRegions: string[]) => void;
}

const RegionFilterModal: React.FC<RegionFilterModalProps> = ({
  onApplyFilter,
}) => {
  const dispatch = useAppDispatch();
  const [selectedMainRegions, setSelectedMainRegions] = useState<string[]>([]);

  const handleRegionToggle = (regionKey: string) => {
    setSelectedMainRegions((prev) =>
      prev.includes(regionKey)
        ? prev.filter((r) => r !== regionKey)
        : [...prev, regionKey]
    );
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedMainRegions);
    dispatch(closeModal());
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal
      title="Filter by Region"
      onClose={handleClose}
      confirmationAction={handleApplyFilter}
      confirmationText="Apply Filter"
      cancelAction={handleClose}
      cancelText="Cancel"
    >
      <div className="space-y-2">
        {mainRegions.map((region) => (
          <Button
            key={region.key}
            onClick={() => handleRegionToggle(region.key)}
            theme={
              selectedMainRegions.includes(region.key) ? "primary" : "secondary"
            }
            block
          >
            {region.name}
          </Button>
        ))}
      </div>
    </Modal>
  );
};

export default RegionFilterModal;
