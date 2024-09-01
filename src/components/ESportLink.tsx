import React from 'react';
import { Link } from 'react-router-dom';

interface ESportLinkProps {
  name: string;
  path: string;
  imageUrl: string;
}

const ESportLink: React.FC<ESportLinkProps> = ({ name, path, imageUrl }) => {
  return (
    <Link to={`/esports/${path}`} className="relative block overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
      <img src={imageUrl} alt={name} className="w-full h-64 object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-white text-center">{name}</h2>
      </div>
    </Link>
  );
};

export default ESportLink;