import React from 'react';
import 'src/styles/SearchBar.css';

const SearchBar: React.FC = () => {
  return (
    <div className="search-bar">
      <input type="search" placeholder="Search" />
    </div>
  );
};

export default SearchBar;
