import React from 'react';
import 'src/styles/components/SearchBar.css';

const SearchBar: React.FC = () => {
  return (
    <div className="search-bar">
      <input type="search" placeholder="Search" />
    </div>
  );
};

export default SearchBar;
