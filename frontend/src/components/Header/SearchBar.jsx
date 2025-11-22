import React from 'react';
export default function SearchBar({value, onSearch}){
  return <input placeholder="Search products..." value={value} onChange={e=>onSearch(e.target.value)} />;
}
