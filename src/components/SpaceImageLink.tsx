import React from 'react';
import { Link } from 'react-router-dom';
import { SvgIcon } from 'src/components';
import { Space } from 'src/types/entities';

interface SpaceImageLinkProps {
  space: Space;
  isFollowed: boolean;
  onToggleFollow: () => void;
}

const SpaceImageLink: React.FC<SpaceImageLinkProps> = ({ space, isFollowed, onToggleFollow }) => {
  // Helper function to safely get properties from both Immutable and regular objects
  const getProperty = (obj: any, prop: string) => {
    return typeof obj.get === 'function' ? obj.get(prop) : obj[prop];
  };

  return (
    <div className="relative">
      <Link to={getProperty(space, 'url')} className="block overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
        <img src={getProperty(space, 'imageUrl')} alt={getProperty(space, 'name')} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-white text-center">{getProperty(space, 'name')}</h2>
        </div>
      </Link>
      <button
        onClick={onToggleFollow}
        className="absolute top-2 right-2 p-2 bg-white bg-opacity-75 rounded-full"
      >
        <SvgIcon
          src={require('@tabler/icons/outline/star.svg')}
          className={`h-6 w-6 ${isFollowed ? 'text-yellow-400' : 'text-gray-400'}`}
        />
      </button>
    </div>
  );
};

export default SpaceImageLink;