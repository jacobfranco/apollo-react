import React, { useState } from 'react';
import { Modal } from 'src/components';
import { closeModal } from 'src/actions/modals';
import { useAppDispatch } from 'src/hooks';
import Button from 'src/components/Button';

interface RegionFilterModalProps {
  onApplyFilter: (selectedRegions: string[]) => void;
}

const RegionFilterModal: React.FC<RegionFilterModalProps> = ({ onApplyFilter }) => {
  const dispatch = useAppDispatch();
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const regions = ['NA', 'EU']; // Hardcoded regions for now

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedRegions);
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
        {regions.map(region => (
          <Button
            key={region}
            onClick={() => handleRegionToggle(region)}
            theme={selectedRegions.includes(region) ? 'primary' : 'secondary'}
            block
          >
            {region}
          </Button>
        ))}
      </div>
    </Modal>
  );
};

export default RegionFilterModal;